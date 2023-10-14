import { Injectable } from '@angular/core';
import { ServiceOfferDto, ServiceOfferStatus } from '@shared/service-proxies/service-proxies';
import { Subject } from 'rxjs';
import * as moment from 'moment';

@Injectable({
    providedIn: 'root'
})
export class ServiceOffersService {
    public newServiceOffer$ = new Subject<ServiceOfferDto>();
    public selectedServiceOffer$ = new Subject<ServiceOfferDto>();
    public purchasedServiceOffer$ = new Subject<ServiceOfferDto>();

    public hasNewServiceOffer(offer: ServiceOfferDto): void {
        this.newServiceOffer$.next(offer);
    }

    public selectServiceOffer(offer: ServiceOfferDto): void {
        this.selectedServiceOffer$.next(offer);
    }

    public hasNewPurchasedServiceOffer(offer: ServiceOfferDto): void {
        this.purchasedServiceOffer$.next(offer);
    }

    public isOfferActive(offer: ServiceOfferDto): boolean {
        if (!offer) return false;
        if (offer.status !== ServiceOfferStatus.Open) return false;
        if (!offer.launchedTime == null) return false;
        if (offer.isNumberOfUnitsLimited) {
            if ((offer.purchases?.length ?? 0) >= offer.unitLimit) return false;
        }
        if (offer.isOfferDurationLimited)
        {
            var endTime = endTime = moment(offer.launchedTime)
                .add(offer.offerLimitDays, 'days')
                .add(offer.offerLimitHours, 'hours')
                .add(offer.offerLimitMinutes, 'minutes');
            if (moment().isAfter(endTime)) return false;
        }
        return true;
    }
}
