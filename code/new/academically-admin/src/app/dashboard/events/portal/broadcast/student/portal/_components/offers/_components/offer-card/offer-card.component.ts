import { Component, Injector, Input, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ServiceCardUtils } from '@shared/helpers/service-card-utils';
import { ServiceOfferDto } from '@shared/service-proxies/service-proxies';
import * as moment from 'moment';

@Component({
  selector: 'app-offer-card',
  templateUrl: './offer-card.component.html',
  styleUrls: ['./offer-card.component.less']
})
export class OfferCardComponent extends AppComponentBase implements OnInit {
  @Input() offer: ServiceOfferDto;
  @Input() isTimerActive = false;

  get serviceName() { return this.offer?.service?.name; }
  get serviceType() { return ServiceCardUtils.getServiceTypeName(this.offer?.service?.serviceType); }
  get servicePriceOriginal() { return this.offer?.service?.price ?? 0; }
  get servicePriceOffer() { return this.offer?.discountAmount ?? (this.servicePriceOriginal * (1 + ((this.offer?.percentageDiscount ?? 0) / 100))); }
  get serviceThumbnail() { return this.offer?.service?.thumbnailImageUrl ? this.offer.service.thumbnailImageUrl : 'assets/img/img-placeholder.png'; }

  get offerUnits() { return this.offer?.unitLimit ?? 0; }
  get offerDuration() {
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
  }

  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
  }

}
