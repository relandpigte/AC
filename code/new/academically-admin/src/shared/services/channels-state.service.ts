import { HubService } from '@app/_shared/services/hub.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { Utils } from '../helpers/utils';
import { ChannelDto, ChannelMemberDto, ChannelMessageDto, ChatsServiceProxy, HubEvent } from '../service-proxies/service-proxies';
import { StateServiceBase, StateUpdate } from './state-base.service';
import { AppStateFeatures } from './pub-sub.service';
import { AppSessionService } from '@shared/session/app-session.service';

export enum channelsType {
    all = 'all',
    inbox = 'inbox',
    archived = 'archived',
    reference = 'reference'
}

const CHANNEL_HUB_NAME = 'channelsHub';
export class ChannelsStateService extends StateServiceBase {
    channels: Map<string, ChannelDto> = new Map();
    totalChannelsCount: number;

    channels$: Subject<StateUpdate<ChannelDto>> = new Subject();
    loading$: BehaviorSubject<boolean> = new BehaviorSubject(true);

    type: channelsType = channelsType.inbox;
    fns = {
        [channelsType.all]: 'getAllChannelsForUser',
        [channelsType.inbox]: 'getAllInboxChannelsForUser',
        [channelsType.archived]: 'getAllArchivedChannelsForUser',
        [channelsType.reference]: 'getReferenceChannelsForUser',
    };

    getAllChannels = () => Array.from(this.channels.values());

    constructor(
        type: channelsType,
        private _appSession: AppSessionService,
        private _hubService: HubService,
        private _chatsService: ChatsServiceProxy
    ) {
        super();
        this.type = type;
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

    async stop() {
        super.stop();
        if (this.getHub(CHANNEL_HUB_NAME)) {
            this.getHub(CHANNEL_HUB_NAME).off(HubEvent[HubEvent.ChannelMessageCreated], this.handleUpsertChannels);
            this.getHub(CHANNEL_HUB_NAME).off(HubEvent[HubEvent.ChannelMessageUpdated], this.handleUpsertChannels);
            this.getHub(CHANNEL_HUB_NAME).off(HubEvent[HubEvent.ChannelMessageDeleted], this.handleDeleteChannels);
            this.getHub(CHANNEL_HUB_NAME).off(HubEvent[HubEvent.ChannelArchive], this.handleUpsertChannels);
            this.getHub(CHANNEL_HUB_NAME).off(HubEvent[HubEvent.ChannelUnarchive], this.handleUpsertChannels);
            if (this.features?.typing) {
                this.getHub(CHANNEL_HUB_NAME).off(HubEvent[HubEvent.ChannelMemberTyping], this.handleChannelMemberTyping);
            }
            this.stopHubConnection(CHANNEL_HUB_NAME);
        }
    }

    protected async setupSubscriptions(component: any, userId: number) {
        try {
            this.addHub(CHANNEL_HUB_NAME, await this._hubService.getChannelsHub(...this.updateArgs));
            this.getHub(CHANNEL_HUB_NAME).on(HubEvent[HubEvent.ChannelMessageCreated], this.handleUpsertChannels);
            this.getHub(CHANNEL_HUB_NAME).on(HubEvent[HubEvent.ChannelMessageUpdated], this.handleUpsertChannels);
            this.getHub(CHANNEL_HUB_NAME).on(HubEvent[HubEvent.ChannelMessageDeleted], this.handleDeleteChannels);
            this.getHub(CHANNEL_HUB_NAME).on(HubEvent[HubEvent.ChannelArchive], this.handleUpsertChannels);
            this.getHub(CHANNEL_HUB_NAME).on(HubEvent[HubEvent.ChannelUnarchive], this.handleUpsertChannels);
            if (this.features?.typing) {
                this.getHub(CHANNEL_HUB_NAME).on(HubEvent[HubEvent.ChannelMemberTyping], this.handleChannelMemberTyping);
            }
            this.startHubConnection(CHANNEL_HUB_NAME);
        } catch (err) {
            console.error(err);
        }
        return null;
    }

    canViewChannel = (channel: ChannelDto): boolean => {
        if (!channel) return false;
        return !channel.isDeleted &&
            (this.type === channelsType.inbox ? !channel.isArchive : true) &&
            (this.type === channelsType.archived ? channel.isArchive : true) &&
            channel.members.some(m => m.userId === this._appSession.userId);
    };

    handleUpsertChannels = async (channelMessage: ChannelMessageDto) => {
        const channel = channelMessage.channel;
        if (!this.canViewChannel(channel)) return;
        this.loading$.next(true);
        this.updateFromMap(this.channels, Utils.toObjectMap([channel], (c) => c.id, (p) => p), this.channels$);
        this.loading$.next(false);
    };

    handleDeleteChannels = async (channelMessage: ChannelMessageDto) => {
        const channel = channelMessage.channel;
        if (!this.canViewChannel(channel)) return;
        this.loading$.next(true);
        this.updateFromMap(this.channels, { [channel.id]: null }, this.channels$);
        this.loading$.next(false);
    }

    handleChannelMemberTyping = async (channel: ChannelDto) => {
        if (!this.canViewChannel(channel)) return;
        this.loading$.next(true);
        this.updateFromMap(this.channels, Utils.toObjectMap([channel], (c) => c.id, (p) => p), this.channels$, true);
        this.loading$.next(false);
    };

    async updateServiceParams(params: { type: channelsType | undefined, args: any[] | undefined }) {
        this.loading$.next(true);
        this.type = params.type;
        this.actionArgs['load'] = params.args;
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
