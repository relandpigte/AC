import { Component, Injector, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as moment from 'moment';

import { AppComponentBase } from '@shared/app-component-base';
import { ServiceOfferDto } from '@shared/service-proxies/service-proxies';
import { ServiceCardUtils } from '@shared/helpers/service-card-utils';


@Component({
  selector: 'app-offer',
  templateUrl: './offer.component.html',
  styleUrls: ['./offer.component.less']
})
export class OfferComponent extends AppComponentBase implements OnInit {
  @Input() offer: ServiceOfferDto;

  model: any = {};

  constructor(injector: Injector) {
    super(injector);
  }

  get serviceName(): string {  return this.offer?.service?.name; }
  get serviceType(): string { return ServiceCardUtils.getServiceTypeName(this.offer?.service?.serviceType).toLowerCase(); }
  get serviceUnit(): number { return this.offer?.unitLimit ?? 0; }
  get servicePriceOrig(): number { return this.offer?.service?.price ?? 0; }
  get isArticle(): boolean { return this.serviceType === 'article'; }
  get isCoaching(): boolean { return this.serviceType === 'coaching'; }
  get servicePriceOffer(): number {
    return this.offer?.discountAmount ??
      this.model.servicePriceOriginal - (this.model.servicePriceOriginal * ((this.offer?.percentageDiscount ?? 0) / 100));
  }
  get serviceOfferDuration(): number {
    const duration = moment.duration();
    if (this.offer?.offerLimitDays) {
      duration.add(this.offer.offerLimitDays, 'days');
    }
    if (this.offer?.offerLimitHours) {
      duration.add(this.offer.offerLimitHours, 'hours');
    }
    if (this.offer?.offerLimitMinutes) {
      duration.add(this.offer.offerLimitMinutes, 'minutes');
    }
    return moment.duration(duration, 'days').hours() ?? 0;
  }
  get thumbnailUrl(): string {return this.offer.service.thumbnailImageUrl || '/assets/img/service/event-placeholder.png'; }
  get coachThumbnailUrl(): string { return this.offer?.service?.creatorUser?.profilePictureUrl; }

  ngOnInit(): void {
    console.warn(this.offer?.service);
  }
}
