import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ServiceCardUtils } from '@shared/helpers/service-card-utils';
import { ServiceOfferDto, ServiceOfferStatus } from '@shared/service-proxies/service-proxies';
import { ServiceOffersService } from '@shared/services/service-offers.service';
import * as moment from 'moment';
import { BehaviorSubject, combineLatest, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-offer-card',
  templateUrl: './offer-card.component.html',
  styleUrls: ['./offer-card.component.less']
})
export class OfferCardComponent extends AppComponentBase implements OnInit {
  @Input() offer: ServiceOfferDto;
  @Input() canClose = false;

  @Output() onClick = new EventEmitter<ServiceOfferDto>();
  @Output() onClose = new EventEmitter();

  isViewingInfo = false;
  isLoadingInitialData$ = new BehaviorSubject<boolean>(false);

  model: any = {};

  ServiceOfferStatus = ServiceOfferStatus;

  constructor(
    injector: Injector,
    private _serviceOffersService: ServiceOffersService
  ) {
    super(injector);

    this._serviceOffersService.purchasedServiceOffer$
      .subscribe(offer => {
        if (this.offer.id === offer.id) {
          this.offer = offer;
        }
      });
  }

  ngOnInit(): void {
    this.initValues();
  }

  get offerStatus(): ServiceOfferStatus { return this.offer?.status; }
  get isPurchased(): boolean { return this.offer?.purchases?.some(p => p.creatorUserId === this.appSession.userId); }
  get isLoading$() { return combineLatest([this.isLoadingInitialData$]).pipe(switchMap((loaders) => of(loaders.some(l => l)))); }

  private initValues(): void {
    this.isLoadingInitialData$.next(true);
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
    this.model['offerAvailableUnits'] = this.offer?.unitLimit - this.offer?.soldCount;
    this.model['offerLaunched'] = this.convertMomentToShorterDateFormat(this.offer?.launchedTime);
    this.model['offerEnded'] = this.convertMomentToShorterDateFormat(this.offer?.endedTime);
    this.getRemainingTime();

    const purchase = this.offer?.purchases?.find(p => p.creatorUserId === this.appSession.userId);
    this.model['offerPurchasedDate'] = this.convertMomentToShorterDateFormat(purchase?.creationTime);
    this.isLoadingInitialData$.next(false);
  }

  onSelectServiceOffer(): void {
    this.onClick.emit(this.offer);
  }

  getRemainingTime(): void {
    const endTime = moment(this.offer.launchedTime).add(this.offer.offerLimitDays, 'days').add(this.offer.offerLimitHours, 'hours').add(this.offer.offerLimitMinutes, 'minutes');
    const duration = moment.duration(endTime.diff(moment()));
    const hours = duration.hours().toLocaleString('en-US', { minimumIntegerDigits:2, useGrouping:false });
    const minutes = duration.minutes().toLocaleString('en-US', { minimumIntegerDigits:2, useGrouping:false });
    const seconds = duration.seconds().toLocaleString('en-US', { minimumIntegerDigits:2, useGrouping:false });
    this.model['offerRemainingTime'] = `${hours}:${minutes}:${seconds}`;

    setTimeout(() => this.getRemainingTime(), 1000);
  }

  onCloseClick(): void {
    this.onClose.emit();
  }

}
