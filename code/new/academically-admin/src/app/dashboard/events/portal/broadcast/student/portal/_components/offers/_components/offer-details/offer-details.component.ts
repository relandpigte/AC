import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ServiceCardUtils } from '@shared/helpers/service-card-utils';
import { ServiceOfferDto } from '@shared/service-proxies/service-proxies';

@Component({
    selector: 'app-offer-details',
    templateUrl: './offer-details.component.html',
    styleUrls: ['./offer-details.component.less']
})
export class OfferDetailsComponent extends AppComponentBase implements OnInit {
    @Input() offer: ServiceOfferDto;
    @Output() onBack = new EventEmitter<void>();

    isDescriptionExpanded = false;

    model: any = {};

    constructor(injector: Injector) {
        super(injector);
    }

    ngOnInit(): void {
        this.initValues();
    }

    private initValues(): void {
        const getDuration = () => {
            let duration = [];
            if (this.offer?.offerLimitDays) {
              duration.push(`${this.offer.offerLimitDays} days`);
            }
            if (this.offer?.offerLimitHours) {
              duration.push(`${this.offer.offerLimitHours} hours`);
            }
            if (this.offer?.offerLimitMinutes) {
              duration.push(`${this.offer.offerLimitMinutes} minutes`);
            }
            return duration.join(' ');
        };

        this.model['serviceName'] = this.offer?.service?.name;
        this.model['serviceType'] = ServiceCardUtils.getServiceTypeName(this.offer?.service?.serviceType);
        this.model['serviceSchedule'] = ServiceCardUtils.getServiceSchedule(this.offer.service);
        this.model['servicePriceOriginal'] = this.offer?.service?.price ?? 0;
        this.model['servicePriceDiscount'] = this.offer?.discountAmount ?? this.model.servicePriceOriginal - (this.model.servicePriceOriginal * ((this.offer?.percentageDiscount ?? 0) / 100));
        this.model['serviceThumbnail'] = this.offer?.service?.thumbnailImageUrl ? this.offer.service.thumbnailImageUrl : 'assets/img/img-placeholder.png';
        this.model['serviceDescription'] = this.offer?.service?.description;
        this.model['offerUnits'] = this.offer?.unitLimit ?? 0;
        this.model['offerDuration'] = getDuration();
    }

    onBackClick(): void {
        this.onBack.next();
    }
}
