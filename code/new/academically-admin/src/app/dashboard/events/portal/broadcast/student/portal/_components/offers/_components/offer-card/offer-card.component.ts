import { Component, Injector, Input, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ServiceCardUtils } from '@shared/helpers/service-card-utils';
import { ServiceOfferDto } from '@shared/service-proxies/service-proxies';
import { ServiceOffersService } from '@shared/services/service-offers.service';
import * as moment from 'moment';

@Component({
  selector: 'app-offer-card',
  templateUrl: './offer-card.component.html',
  styleUrls: ['./offer-card.component.less']
})
export class OfferCardComponent extends AppComponentBase implements OnInit {
  @Input() offer: ServiceOfferDto;
  @Input() isTimerActive = false;

  isViewingInfo = false;

  model: any = {};

  constructor(
    injector: Injector,
    private _serviceOffersService: ServiceOffersService
  ) {
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
    }

    this.model['serviceName'] = this.offer?.service?.name;
    this.model['serviceType'] = ServiceCardUtils.getServiceTypeName(this.offer?.service?.serviceType);
    this.model['servicePriceOriginal'] = this.offer?.service?.price ?? 0;
    this.model['servicePriceOffer'] = this.offer?.discountAmount ?? this.model.servicePriceOriginal - (this.model.servicePriceOriginal * ((this.offer?.percentageDiscount ?? 0) / 100));
    this.model['serviceThumbnail'] = this.offer?.service?.thumbnailImageUrl ? this.offer.service.thumbnailImageUrl : 'assets/img/img-placeholder.png';
    this.model['offerUnits'] = this.offer?.unitLimit ?? 0;
    this.model['offerDuration'] = getDuration();
  }

  onSelectServiceOffer(): void {
    this._serviceOffersService.selectServiceOffer(this.offer);
  }

}
