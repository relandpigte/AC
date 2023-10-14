import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ServiceCardUtils } from '@shared/helpers/service-card-utils';
import { CreateServicePurchaseDto, ServiceOfferDto, ServicesServiceProxy } from '@shared/service-proxies/service-proxies';
import { ServiceOffersService } from '@shared/services/service-offers.service';
import * as moment from 'moment';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, combineLatest, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.less']
})
export class PurchaseComponent extends AppComponentBase implements OnInit {
  @Input() offer: ServiceOfferDto;
  @Output() onPaid = new EventEmitter<ServiceOfferDto>();

  isSubmitting$ = new BehaviorSubject<boolean>(false);

  model: any = {};

  constructor(
    injector: Injector,
    private _modal: BsModalRef,
    private _serviceOffersService: ServiceOffersService,
    private _servicesService: ServicesServiceProxy
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.initValues();
  }

  get isLoading$() { return combineLatest([this.isSubmitting$]).pipe(switchMap((loaders) => of(loaders.some(l => l)))); }
  get isOfferInvalid(): boolean { return !this._serviceOffersService.isOfferActive(this.offer); }

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
    this.model['offerSoldCount'] = this.offer?.purchases?.length ?? 0;
    this.model['offerUnits'] = this.offer?.unitLimit ?? 0;
    this.model['offerDuration'] = getDuration();
    this.model['offerAvailableUnits'] = this.offer?.unitLimit - (this.offer?.purchases?.length ?? 0);
    this.model['offerLaunched'] = this.convertMomentToShorterDateFormat(this.offer?.launchedTime);
    this.model['offerEnded'] = this.convertMomentToShorterDateFormat(this.offer?.endedTime);
    this.getRemainingTime();
  }

  getRemainingTime(): void {
    const endTime = moment(this.offer.launchedTime).add(this.offer.offerLimitDays, 'days').add(this.offer.offerLimitHours, 'hours').add(this.offer.offerLimitMinutes, 'minutes');
    const duration = moment.duration(endTime.diff(moment()));
    const hours = duration.hours().toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });
    const minutes = duration.minutes().toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });
    const seconds = duration.seconds().toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });
    this.model['offerRemainingTime'] = `${hours}:${minutes}:${seconds}`;

    setTimeout(() => this.getRemainingTime(), 1000);
  }

  onCancelClick(): void {
    this._modal.hide();
  }

  onCloseClick(): void {
    this._modal.hide();
  }

  async onPayClick() {
    this.isSubmitting$.next(true);
    try {
      const purchase = await this._servicesService.savePurchase(CreateServicePurchaseDto.fromJS({
        referenceId: this.offer.service.id,
        serviceOfferId: this.offer.id,
        creatorUserId: this.appSession.userId,
      })).toPromise();
      const newOffer = await this._servicesService.getServiceOffer(purchase.serviceOfferId).toPromise();
      this._serviceOffersService.hasNewPurchasedServiceOffer(newOffer);
      this._modal.hide();
      this.onPaid.emit();
    } catch (err) {
      console.error(err);
    }
    this.isSubmitting$.next(false);
  }
}
