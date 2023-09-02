import { HubService } from '@app/_shared/services/hub.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { Utils } from '../helpers/utils';
import { ChannelDto, ChatsServiceProxy, HubEvent } from '../service-proxies/service-proxies';
import { StateServiceBase, StateUpdate } from './state-base.service';

export enum channelsType {
    all = 'all',
    inbox = 'inbox',
    archived = 'archived'
}

export class ChannelsStateService extends StateServiceBase {
    channels: Map<string, ChannelDto> = new Map();
    totalChannelsCount: number;

    channels$: Subject<StateUpdate<ChannelDto>> = new Subject();
    loading$: BehaviorSubject<boolean> = new BehaviorSubject(true);

    type: channelsType;
    fns = {
        [channelsType.all]: 'getAllChannelsForUser',
        [channelsType.inbox]: 'getAllInboxChannelsForUser',
        [channelsType.archived]: 'getAllArchivedChannelsForUser',
    };

    getAllChannels = () => Array.from(this.channels.values());

    constructor(
        private _hubService: HubService,
        private _chatsService: ChatsServiceProxy
    ) {
        super();
    }

    async loadData(component: any, userId: number) {
        this.loading$.next(true);
        try {
          const channels = await this._chatsService[this.fns[this.type ?? channelsType.all]](...this.loadArgs).toPromise();
          this.channels = Utils.toMap(channels);
          this.totalChannelsCount = channels.length;
        } catch (err) {
          console.error(err);
        }
        this.loading$.next(false);
    }

    protected async setupSubscriptions(component: any, userId: number) {
        try {
            const hub = await this._hubService.getChannelsHub(...this.updateArgs);
            hub.on(HubEvent[HubEvent.ChatCreated], this.handleUpsertChannels);
            hub.on(HubEvent[HubEvent.ChatUpdated], this.handleUpsertChannels);
            hub.on(HubEvent[HubEvent.ChatDeleted], this.handleDeleteChannels);
            hub.on(HubEvent[HubEvent.ChatTyping], this.handleUpsertChannels);
        } catch (err) {
            console.error(err);
        }
        return null;
    }

    canViewChannel = (channel: ChannelDto): boolean => {
        if (!channel) return false;
        const [userId] = this.loadArgs;
        return !channel.isDeleted &&
            (this.type === channelsType.inbox ? !channel.isArchive : true) &&
            (this.type === channelsType.archived ? channel.isArchive : true) &&
            channel.members.some(m => m.userId === userId);
    };

    handleUpsertChannels = async (channel: ChannelDto) => {
        if (!this.canViewChannel(channel)) return;
        this.loading$.next(true);
        this.updateFromMap(this.channels, Utils.toObjectMap([channel], (c) => c.id, (p) => p), this.channels$);
        this.loading$.next(false);
    };

    handleDeleteChannels = async (channel: ChannelDto) => {
        if (!this.canViewChannel(channel)) return;
        this.loading$.next(true);
        this.updateFromMap(this.channels, { [channel.id]: null }, this.channels$);
        this.loading$.next(false);
    }

    async updateServiceParams(params: { type: channelsType | undefined, userId: number | undefined }) {
        this.loading$.next(true);
        this.type = params.type;
        this.actionArgs['load'] = [params.userId];
        try {
          const channels = await this._chatsService[this.fns[this.type ?? channelsType.all]](...this.loadArgs).toPromise();
          this.channels = Utils.toMap(channels);
          this.totalChannelsCount = channels.length;
        } catch (err) {
          console.error(err);
        }
        this.loading$.next(false);
    }
}
