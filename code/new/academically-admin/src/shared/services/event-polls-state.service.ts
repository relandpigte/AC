import { HubService } from '@app/_shared/services/hub.service';
import { AppSessionService } from '@shared/session/app-session.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { Utils } from '../helpers/utils';
import { EventPollDto, EventPollStatus, EventPollsServiceProxy, HubEvent, ServiceOfferDto, ServiceOfferStatus, ServicesServiceProxy } from '../service-proxies/service-proxies';
import { StateServiceBase, StateUpdate } from './state-base.service';

export enum pollsType {
    all = 'all',
    queued = 'queued',
    opened = 'opened',
    closed = 'closed',
    todo = 'todo',
    results = 'results'
}

export class EventPollsStateService extends StateServiceBase {
    polls: Map<string, EventPollDto> = new Map();
    totalPollsCount: number;

    polls$: Subject<StateUpdate<EventPollDto>> = new Subject();
    loading$: BehaviorSubject<boolean> = new BehaviorSubject(true);

    hub: any;

    type: pollsType = pollsType.queued;
    fns = {
        [pollsType.all]: 'getAllUnpaged',
        [pollsType.queued]: 'getAllUnpaged',
        [pollsType.opened]: 'getAllUnpaged',
        [pollsType.closed]: 'getAllUnpaged',
        [pollsType.todo]: 'getAllUnpagedForStudents',
        [pollsType.results]: 'getAllUnpagedForStudents',
    };

    getAllPolls = () => Array.from(this.polls.values());

    constructor(
        type: pollsType,
        private _appSession: AppSessionService,
        private _hubService: HubService,
        private _eventPollsService: EventPollsServiceProxy
    ) {
        super();
        this.type = type;
    }

    async loadData(component: any, userId: number) {
        this.loading$.next(true);
        try {
          const polls = await this._eventPollsService[this.fns[this.type ?? pollsType.all]](...this.loadArgs).toPromise();
          this.polls = Utils.toMap(polls);
          this.totalPollsCount = polls.length;
        } catch (err) {
          console.error(err);
        }
        this.loading$.next(false);
    }

    async stop() {
        super.stop();
        if (this.hub) {
            this.hub.off(HubEvent[HubEvent.EventPollCreated], this.handleUpsertPolls);
            this.hub.off(HubEvent[HubEvent.EventPollUpdated], this.handleUpsertPolls);
            this.hub.off(HubEvent[HubEvent.EventPollDeleted], this.handleDeletePolls);
            this.hub.off(HubEvent[HubEvent.EventPollLaunched], this.handleLaunchedPolls);
            this.hub.off(HubEvent[HubEvent.EventPollClosed], this.handleClosedPolls);
            this.hub.off(HubEvent[HubEvent.EventPollShared], this.handleSharedPolls);
        }
    }

    protected async setupSubscriptions(component: any, userId: number) {
        try {
            this.hub = await this._hubService.getEventPollsHub(...this.updateArgs);
            this.hub.on(HubEvent[HubEvent.EventPollCreated], this.handleUpsertPolls);
            this.hub.on(HubEvent[HubEvent.EventPollUpdated], this.handleUpsertPolls);
            this.hub.on(HubEvent[HubEvent.EventPollDeleted], this.handleDeletePolls);
            this.hub.on(HubEvent[HubEvent.EventPollLaunched], this.handleLaunchedPolls);
            this.hub.on(HubEvent[HubEvent.EventPollClosed], this.handleClosedPolls);
            this.hub.on(HubEvent[HubEvent.EventPollShared], this.handleSharedPolls);
        } catch (err) {
            console.error(err);
        }
        return null;
    }

    canViewPoll = (poll: EventPollDto): boolean => {
        if (!poll) return false;
        return (this.type === pollsType.queued ? poll.status === EventPollStatus.Queue : true) &&
            (this.type === pollsType.opened ? poll.status === EventPollStatus.Open : true) &&
            (this.type === pollsType.closed ? poll.status === EventPollStatus.Closed : true) &&
            (this.type === pollsType.todo ? poll.status === EventPollStatus.Open && poll.eventPollQuestions?.some(q => !q.hasBeenAnswered) : true) &&
            (this.type === pollsType.results ? poll.status !== EventPollStatus.Queue && poll.eventPollQuestions?.every(q => q.hasBeenAnswered) : true);
    };

    handleUpsertPolls = async (poll: EventPollDto) => {
        this.loading$.next(true);
        try {
            const updated = await this._eventPollsService.get(poll.id).toPromise();
            if (this.canViewPoll(updated)) {
                this.updateFromMap(this.polls, Utils.toObjectMap([updated], (o) => o.id, (p) => p), this.polls$);
            } else {
                this.handleDeletePolls(poll);
            }
        } catch (err) {
            console.error(err);
        }
        this.loading$.next(false);
    };

    handleDeletePolls = async (poll: EventPollDto) => {
        this.loading$.next(true);
        this.updateFromMap(this.polls, { [poll.id]: null }, this.polls$);
        this.loading$.next(false);
    }

    handleLaunchedPolls = async (poll: EventPollDto) => {
        if (!this.canViewPoll(poll)) return;
        this.loading$.next(true);
        try {
            const launched = await this._eventPollsService.get(poll.id).toPromise();
            this.updateFromMap(this.polls, Utils.toObjectMap([launched], (o) => o.id, (p) => p), this.polls$);
            this.polls$.next({ data: launched, type: 'launched', silent: false });
        } catch (err) {
            console.error(err);
        }
        this.loading$.next(false);
    }

    handleClosedPolls = async (poll: EventPollDto) => {
        if (!this.canViewPoll(poll)) return;
        this.loading$.next(true);
        try {
            const closed = await this._eventPollsService.get(poll.id).toPromise();
            this.updateFromMap(this.polls, Utils.toObjectMap([closed], (o) => o.id, (p) => p), this.polls$);
            this.polls$.next({ data: closed, type: 'closed', silent: false });
        } catch (err) {
            console.error(err);
        }
        this.loading$.next(false);
    }

    handleSharedPolls = async (poll: EventPollDto) => {
        if (!this.canViewPoll(poll)) return;
        this.loading$.next(true);
        try {
            const closed = await this._eventPollsService.get(poll.id).toPromise();
            this.updateFromMap(this.polls, Utils.toObjectMap([closed], (o) => o.id, (p) => p), this.polls$);
            this.polls$.next({ data: closed, type: 'shared', silent: false });
        } catch (err) {
            console.error(err);
        }
        this.loading$.next(false);
    }

    async updateServiceParams(params: { type: pollsType | undefined, args: any[] | undefined }) {
        this.loading$.next(true);
        this.type = params.type;
        this.actionArgs['load'] = params.args;
        try {
          const polls = await this._eventPollsService[this.fns[this.type ?? pollsType.all]](...this.loadArgs).toPromise();
          this.polls = Utils.toMap(polls);
          this.totalPollsCount = polls.length;
        } catch (err) {
          console.error(err);
        }
        this.loading$.next(false);
    }
}
