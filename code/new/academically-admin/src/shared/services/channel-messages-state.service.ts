import { HubService } from '@app/_shared/services/hub.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { Utils } from '../helpers/utils';
import { ChannelMessageDto, ChatsServiceProxy, HubEvent } from '../service-proxies/service-proxies';
import { StateServiceBase, StateUpdate } from './state-base.service';

export enum channelMessagesType {
    all = 'all'
}

export class ChannelMessagesStateService extends StateServiceBase {
    channelMessages: Map<string, ChannelMessageDto> = new Map();
    totalChannelMessagesCount: number;

    channelMessages$: Subject<StateUpdate<ChannelMessageDto>> = new Subject();
    loading$: BehaviorSubject<boolean> = new BehaviorSubject(true);

    type: channelMessagesType;
    fns = {
        [channelMessagesType.all]: 'getAllChannelMessages'
    };

    getAllChannelMessages = () => Array.from(this.channelMessages.values());

    constructor(
        private _hubService: HubService,
        private _chatsService: ChatsServiceProxy
    ) {
        super();
    }

    async loadData(component: any, userId: number) {
        this.loading$.next(true);
        try {
          const channelMessages = await this._chatsService[this.fns[this.type ?? channelMessagesType.all]](...this.loadArgs).toPromise();
          this.channelMessages = Utils.toMap(channelMessages);
          this.totalChannelMessagesCount = channelMessages.length;
        } catch (err) {
          console.error(err);
        }
        this.loading$.next(false);
    }

    protected async setupSubscriptions(component: any, userId: number) {
        try {
            const hub = await this._hubService.getChannelMessagesHub(...this.updateArgs);
            hub.on(HubEvent[HubEvent.ChatCreated], this.handleUpsertChannelMessages);
            hub.on(HubEvent[HubEvent.ChatUpdated], this.handleUpsertChannelMessages);
            hub.on(HubEvent[HubEvent.ChatDeleted], this.handleDeleteChannelMessages);
            hub.on(HubEvent[HubEvent.ChatTyping], this.handleUpsertChannelMessages);
        } catch (err) {
            console.error(err);
        }
        return null;
    }

    canViewChannelMessage = (channelMessage: ChannelMessageDto): boolean => {
        if (!channelMessage) return false;
        const [channelId] = this.loadArgs;
        return !channelMessage.isDeleted && channelMessage.channelId === channelId;
    };

    handleUpsertChannelMessages = async (channelMessage: ChannelMessageDto) => {
        if (!this.canViewChannelMessage(channelMessage)) return;
        this.loading$.next(true);
        this.updateFromMap(this.channelMessages, Utils.toObjectMap([channelMessage], (c) => c.id, (p) => p), this.channelMessages$);
        this.loading$.next(false);
    };

    handleDeleteChannelMessages = async (channelMessage: ChannelMessageDto) => {
        if (!this.canViewChannelMessage(channelMessage)) return;
        this.loading$.next(true);
        this.updateFromMap(this.channelMessages, { [channelMessage.id]: null }, this.channelMessages$);
        this.loading$.next(false);
    }

    async updateServiceParams(params: { type: channelMessagesType | undefined, channelId: string | undefined }) {
        this.loading$.next(true);
        this.type = params.type;
        this.actionArgs['load'] = [params.channelId];
        try {
          const channelMessages = await this._chatsService[this.fns[this.type ?? channelMessagesType.all]](...this.loadArgs).toPromise();
          this.channelMessages = Utils.toMap(channelMessages);
          this.totalChannelMessagesCount = channelMessages.length;
        } catch (err) {
          console.error(err);
        }
        this.loading$.next(false);
    }
}
