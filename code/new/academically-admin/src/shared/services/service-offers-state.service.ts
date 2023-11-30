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

const SERVICE_OFFERS_HUB_NAME = 'serviceOffersHub';

export class ServiceOffersStateService extends StateServiceBase {
    offers: Map<string, ServiceOfferDto> = new Map();
    totalOffersCount: number;

    offers$: Subject<StateUpdate<ServiceOfferDto>> = new Subject();
    loading$: BehaviorSubject<boolean> = new BehaviorSubject(true);

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
        if (this.getHub(SERVICE_OFFERS_HUB_NAME)) {
            this.getHub(SERVICE_OFFERS_HUB_NAME).off(HubEvent[HubEvent.ServiceOfferCreated], this.handleUpsertOffers);
            this.getHub(SERVICE_OFFERS_HUB_NAME).off(HubEvent[HubEvent.ServiceOfferUpdated], this.handleUpsertOffers);
            this.getHub(SERVICE_OFFERS_HUB_NAME).off(HubEvent[HubEvent.ServiceOfferDeleted], this.handleDeleteOffers);
            this.getHub(SERVICE_OFFERS_HUB_NAME).off(HubEvent[HubEvent.ServiceOfferLaunched], this.handleLaunchedOffers);
            this.getHub(SERVICE_OFFERS_HUB_NAME).off(HubEvent[HubEvent.ServiceOfferClosed], this.handleClosedOffers);
            this.stopHubConnection(SERVICE_OFFERS_HUB_NAME);
        }
    }

    protected async setupSubscriptions(component: any, userId: number) {
        try {
            this.addHub(SERVICE_OFFERS_HUB_NAME, await this._hubService.getServiceOffersHub(...this.updateArgs));
            this.getHub(SERVICE_OFFERS_HUB_NAME).on(HubEvent[HubEvent.ServiceOfferCreated], this.handleUpsertOffers);
            this.getHub(SERVICE_OFFERS_HUB_NAME).on(HubEvent[HubEvent.ServiceOfferUpdated], this.handleUpsertOffers);
            this.getHub(SERVICE_OFFERS_HUB_NAME).on(HubEvent[HubEvent.ServiceOfferDeleted], this.handleDeleteOffers);
            this.getHub(SERVICE_OFFERS_HUB_NAME).on(HubEvent[HubEvent.ServiceOfferLaunched], this.handleLaunchedOffers);
            this.getHub(SERVICE_OFFERS_HUB_NAME).on(HubEvent[HubEvent.ServiceOfferClosed], this.handleClosedOffers);
            this.startHubConnection(SERVICE_OFFERS_HUB_NAME);
        } catch (err) {
            console.error(err);
        }
        return null;
    }

    canViewOffer = (offer: ServiceOfferDto): boolean => {
        if (!offer) return false;
        const isPurchased = this.loadArgs?.[2];
        return !offer.isDeleted &&
            (this.type === offersType.queued ? offer.status === ServiceOfferStatus.Queued : true) &&
            (this.type === offersType.opened ? offer.status === ServiceOfferStatus.Open : true) &&
            (this.type === offersType.closed ? offer.status === ServiceOfferStatus.Closed : true) &&
            (
                isPurchased !== undefined && isPurchased !== null ?
                    (
                        isPurchased === true ?
                            offer.purchases?.some(p => p.creatorUserId === this._appSession.userId)
                        :
                            !offer.purchases?.some(p => p.creatorUserId === this._appSession.userId)
                    )
                :
                    true
            );
    };

    handleUpsertOffers = async (offer: ServiceOfferDto) => {
        this.loading$.next(true);
        try {
            const updated = await this._servicesService.getServiceOffer(offer.id).toPromise();
            if (this.canViewOffer(updated)) {
                this.updateFromMap(this.offers, Utils.toObjectMap([updated], (o) => o.id, (p) => p), this.offers$);
            } else {
                this.handleDeleteOffers(offer);
            }
        } catch (err) {
            console.error(err);
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
