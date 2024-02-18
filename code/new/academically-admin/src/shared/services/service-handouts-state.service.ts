import { HubService } from '@app/_shared/services/hub.service';
import { AppSessionService } from '@shared/session/app-session.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { Utils } from '../helpers/utils';
import { EventPollDto, EventPollStatus, EventPollsServiceProxy, HubEvent, ServiceHandoutDto, ServiceOfferDto, ServiceOfferStatus, ServicesServiceProxy } from '../service-proxies/service-proxies';
import { StateServiceBase, StateUpdate } from './state-base.service';

const SERVICE_HANDOUTS_HUB_NAME = 'serviceHandoutsHub';
export class ServiceHandoutsStateService extends StateServiceBase {
    handouts: Map<string, ServiceHandoutDto> = new Map();
    totalHandoutsCount: number;

    handouts$: Subject<StateUpdate<ServiceHandoutDto>> = new Subject();
    loading$: BehaviorSubject<boolean> = new BehaviorSubject(true);

    getAllHandouts = () => Array.from(this.handouts.values()).filter(h => this.canViewHandout(h));

    constructor(
        private _appSession: AppSessionService,
        private _hubService: HubService,
        private _servicesService: ServicesServiceProxy
    ) {
        super();
    }

    async loadData(component: any, userId: number) {
        this.loading$.next(true);
        try {
          const handouts = await this._servicesService.getAllServiceHandouts(this.loadArgs[0]).toPromise();
          this.handouts = Utils.toMap(handouts);
          this.totalHandoutsCount = handouts.length;
        } catch (err) {
          console.error(err);
        }
        this.loading$.next(false);
    }

    async stop() {
        super.stop();
        if (this.getHub(SERVICE_HANDOUTS_HUB_NAME)) {
            this.getHub(SERVICE_HANDOUTS_HUB_NAME).off(HubEvent[HubEvent.ServiceHandoutCreated], this.handleUpsertHandouts);
            this.getHub(SERVICE_HANDOUTS_HUB_NAME).off(HubEvent[HubEvent.ServiceHandoutUpdated], this.handleUpsertHandouts);
            this.getHub(SERVICE_HANDOUTS_HUB_NAME).off(HubEvent[HubEvent.ServiceHandoutDeleted], this.handleDeleteHandouts);
            this.getHub(SERVICE_HANDOUTS_HUB_NAME).off(HubEvent[HubEvent.ServiceHandoutShared], this.handleSharedHandouts);
            this.stopHubConnection(SERVICE_HANDOUTS_HUB_NAME);
        }
    }

    protected async setupSubscriptions(component: any, userId: number) {
        try {
            this.addHub(SERVICE_HANDOUTS_HUB_NAME, await this._hubService.getServiceHandoutsHub(...this.updateArgs));
            this.getHub(SERVICE_HANDOUTS_HUB_NAME).on(HubEvent[HubEvent.ServiceHandoutCreated], this.handleUpsertHandouts);
            this.getHub(SERVICE_HANDOUTS_HUB_NAME).on(HubEvent[HubEvent.ServiceHandoutUpdated], this.handleUpsertHandouts);
            this.getHub(SERVICE_HANDOUTS_HUB_NAME).on(HubEvent[HubEvent.ServiceHandoutDeleted], this.handleDeleteHandouts);
            this.getHub(SERVICE_HANDOUTS_HUB_NAME).on(HubEvent[HubEvent.ServiceHandoutShared], this.handleSharedHandouts);
            this.startHubConnection(SERVICE_HANDOUTS_HUB_NAME);
        } catch (err) {
            console.error(err);
        }
        return null;
    }

    canViewHandout = (handout: ServiceHandoutDto): boolean => {
        if (!handout) return false;
        return handout.creatorUserId === this._appSession.userId || !!handout.shareTime;
    };

    handleUpsertHandouts = async (handout: ServiceHandoutDto) => {
        this.loading$.next(true);
        try {
            const updated = await this._servicesService.getServiceHandout(handout.id).toPromise();
            if (this.canViewHandout(updated)) {
                this.updateFromMap(this.handouts, Utils.toObjectMap([updated], (o) => o.id, (p) => p), this.handouts$);
            } else {
                this.handleDeleteHandouts(handout);
            }
        } catch (err) {
            console.error(err);
        }
        this.loading$.next(false);
    };

    handleDeleteHandouts = async (handout: ServiceHandoutDto) => {
        this.loading$.next(true);
        this.updateFromMap(this.handouts, { [handout.id]: null }, this.handouts$);
        this.loading$.next(false);
    }

    handleSharedHandouts = async (handout: ServiceHandoutDto) => {
        if (!this.canViewHandout(handout)) return;
        this.loading$.next(true);
        try {
            const shared = await this._servicesService.getServiceHandout(handout.id).toPromise();
            this.updateFromMap(this.handouts, Utils.toObjectMap([shared], (o) => o.id, (p) => p), this.handouts$);
            this.handouts$.next({ data: shared, type: 'shared', silent: false });
        } catch (err) {
            console.error(err);
        }
        this.loading$.next(false);
    }

    async updateServiceParams(params: { args: any[] | undefined }) {
        this.loading$.next(true);
        this.actionArgs['load'] = params.args;
        try {
          const handouts = await this._servicesService.getAllServiceHandouts(this.loadArgs[0]).toPromise();
          this.handouts = Utils.toMap(handouts);
          this.totalHandoutsCount = handouts.length;
        } catch (err) {
          console.error(err);
        }
        this.loading$.next(false);
    }
}
