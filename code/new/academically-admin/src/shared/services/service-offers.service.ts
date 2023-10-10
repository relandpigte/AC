import { Injectable } from '@angular/core';
import { ServiceOfferDto } from '@shared/service-proxies/service-proxies';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ServiceOffersService {
    public newServiceOffer$ = new Subject<ServiceOfferDto>();

    public hasNewServiceOffer(offer: ServiceOfferDto): void {
        this.newServiceOffer$.next(offer);
    }
}
