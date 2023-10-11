import { HubService } from '@app/_shared/services/hub.service';
import { AppSessionService } from '@shared/session/app-session.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { Utils } from '../helpers/utils';
import { HubEvent, ServiceOfferDto, ServiceOfferStatus, ServicesServiceProxy } from '../service-proxies/service-proxies';
import { StateServiceBase, StateUpdate } from './state-base.service';

export enum offersType {
    all = 'all',
    queued = 'queued',
    opened = 'opened',
    closed = 'closed'
}

export class ServiceOffersStateService extends StateServiceBase {
    offers: Map<string, ServiceOfferDto> = new Map();
    totalOffersCount: number;

    offers$: Subject<StateUpdate<ServiceOfferDto>> = new Subject();
    loading$: BehaviorSubject<boolean> = new BehaviorSubject(true);

    hub: any;

    type: offersType = offersType.queued;
    fns = {
        [offersType.all]: 'getServiceOffers',
        [offersType.queued]: 'getServiceOffers',
        [offersType.opened]: 'getServiceOffers',
        [offersType.closed]: 'getServiceOffers',
    };

    getAllOffers = () => Array.from(this.offers.values());

    constructor(
        type: offersType,
        private _appSession: AppSessionService,
        private _hubService: HubService,
        private _servicesService: ServicesServiceProxy
    ) {
        super();
        this.type = type;
    }

    async loadData(component: any, userId: number) {
        this.loading$.next(true);
        try {
          const offers = await this._servicesService[this.fns[this.type ?? offersType.all]](...this.loadArgs).toPromise();
          this.offers = Utils.toMap(offers);
          this.totalOffersCount = offers.length;
        } catch (err) {
          console.error(err);
        }
        this.loading$.next(false);
    }

    async stop() {
        super.stop();
        if (this.hub) {
            this.hub.off(HubEvent[HubEvent.ServiceOfferCreated], this.handleUpsertOffers);
            this.hub.off(HubEvent[HubEvent.ServiceOfferUpdated], this.handleUpsertOffers);
            this.hub.off(HubEvent[HubEvent.ServiceOfferDeleted], this.handleDeleteOffers);
            this.hub.off(HubEvent[HubEvent.ServiceOfferLaunched], this.handleLaunchedOffers);
            this.hub.off(HubEvent[HubEvent.ServiceOfferClosed], this.handleClosedOffers);
        }
    }

    protected async setupSubscriptions(component: any, userId: number) {
        try {
            this.hub = await this._hubService.getServiceOffersHub(...this.updateArgs);
            this.hub.on(HubEvent[HubEvent.ServiceOfferCreated], this.handleUpsertOffers);
            this.hub.on(HubEvent[HubEvent.ServiceOfferUpdated], this.handleUpsertOffers);
            this.hub.on(HubEvent[HubEvent.ServiceOfferDeleted], this.handleDeleteOffers);
            this.hub.on(HubEvent[HubEvent.ServiceOfferLaunched], this.handleLaunchedOffers);
            this.hub.on(HubEvent[HubEvent.ServiceOfferClosed], this.handleClosedOffers);
        } catch (err) {
            console.error(err);
        }
        return null;
    }

    canViewOffer = (offer: ServiceOfferDto): boolean => {
        if (!offer) return false;
        return !offer.isDeleted &&
            (this.type === offersType.queued ? offer.status === ServiceOfferStatus.Queued : true) &&
            (this.type === offersType.opened ? offer.status === ServiceOfferStatus.Open : true) &&
            (this.type === offersType.closed ? offer.status === ServiceOfferStatus.Closed : true);
    };

    handleUpsertOffers = async (offer: ServiceOfferDto) => {
        this.loading$.next(true);
        if (this.canViewOffer(offer)) {
            try {
                const updated = await this._servicesService.getServiceOffer(offer.id).toPromise();
                this.updateFromMap(this.offers, Utils.toObjectMap([updated], (o) => o.id, (p) => p), this.offers$);
            } catch (err) {
                console.error(err);
            }
        } else {
            this.handleDeleteOffers(offer);
        }
        this.loading$.next(false);
    };

    handleDeleteOffers = async (offer: ServiceOfferDto) => {
        this.loading$.next(true);
        this.updateFromMap(this.offers, { [offer.id]: null }, this.offers$);
        this.loading$.next(false);
    }

    handleLaunchedOffers = async (offer: ServiceOfferDto) => {
        if (!this.canViewOffer(offer)) return;
        this.loading$.next(true);
        try {
            const launched = await this._servicesService.getServiceOffer(offer.id).toPromise();
            this.updateFromMap(this.offers, Utils.toObjectMap([launched], (o) => o.id, (p) => p), this.offers$);
            this.offers$.next({ data: launched, type: 'launched', silent: false });
        } catch (err) {
            console.error(err);
        }
        this.loading$.next(false);
    }

    handleClosedOffers = async (offer: ServiceOfferDto) => {
        if (!this.canViewOffer(offer)) return;
        this.loading$.next(true);
        try {
            const closed = await this._servicesService.getServiceOffer(offer.id).toPromise();
            this.updateFromMap(this.offers, Utils.toObjectMap([closed], (o) => o.id, (p) => p), this.offers$);
            this.offers$.next({ data: closed, type: 'closed', silent: false });
        } catch (err) {
            console.error(err);
        }
        this.loading$.next(false);
    }

    async updateServiceParams(params: { type: offersType | undefined, args: any[] | undefined }) {
        this.loading$.next(true);
        this.type = params.type;
        this.actionArgs['load'] = params.args;
        try {
          const offers = await this._servicesService[this.fns[this.type ?? offersType.all]](...this.loadArgs).toPromise();
          this.offers = Utils.toMap(offers);
          this.totalOffersCount = offers.length;
        } catch (err) {
          console.error(err);
        }
        this.loading$.next(false);
    }
}
