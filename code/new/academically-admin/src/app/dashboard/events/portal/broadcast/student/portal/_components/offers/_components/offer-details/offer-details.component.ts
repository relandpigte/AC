import { AfterViewInit, Component, EventEmitter, Injector, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AppConsts } from '@shared/AppConsts';
import { AppComponentBase } from '@shared/app-component-base';
import { ServiceCardUtils } from '@shared/helpers/service-card-utils';
import { CreateServiceOfferDto, ServiceOfferDto, ServiceOfferStatus, ServicesServiceProxy } from '@shared/service-proxies/service-proxies';
import { ServiceOffersService } from '@shared/services/service-offers.service';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, combineLatest, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { CreateOfferComponent } from '../create-offer/create-offer.component';
import { PurchaseComponent } from '../purchase/purchase.component';
import * as moment from 'moment';

@Component({
    selector: 'app-offer-details',
    templateUrl: './offer-details.component.html',
    styleUrls: ['./offer-details.component.less']
})
export class OfferDetailsComponent extends AppComponentBase implements OnInit, AfterViewInit {
    @Input() offer: ServiceOfferDto;
    @Input() purchases: any[];
    @Input() isHost = false;
    @Output() onBack = new EventEmitter<void>();

    isDescriptionExpanded = false;
    isDescriptionOverflows = false;

    isLoadingInitialData$ = new BehaviorSubject<boolean>(false);
    isSubmitting$ = new BehaviorSubject<boolean>(false);

    model: any = {};

    ServiceOfferStatus = ServiceOfferStatus;

    @ViewChild('descriptionEl') descriptionEl: any;

    constructor(
        injector: Injector,
        private _servicesService: ServicesServiceProxy,
        private _serviceOffersService: ServiceOffersService,
        private _modalService: BsModalService
    ) {
        super(injector);

        this._serviceOffersService.newServiceOffer$
            .subscribe(offer => {
                if (offer.id === this.offer.id) {
                    this.offer = offer;
                    this.initValues();
                }
            })
    }

    ngOnInit(): void {
        this.initValues();
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.isDescriptionOverflows = this.descriptionEl?.nativeElement?.offsetHeight > 100;
        });
    }

    get offerStatus(): ServiceOfferStatus { return this.offer?.status;}
    get canEdit(): boolean { return this.offer?.status === ServiceOfferStatus.Queued; }
    get isLoading$() { return combineLatest([this.isLoadingInitialData$, this.isSubmitting$]).pipe(switchMap((loaders) => of(loaders.some(l => l)))); }
    get isPurchased(): boolean { return this.purchases !== undefined; }

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
        };

        this.model['serviceName'] = this.offer?.service?.name;
        this.model['serviceType'] = ServiceCardUtils.getServiceTypeName(this.offer?.service?.serviceType);
        this.model['serviceSchedule'] = ServiceCardUtils.getServiceSchedule(this.offer.service);
        this.model['servicePriceOriginal'] = this.offer?.service?.price ?? 0;
        this.model['servicePriceDiscount'] = this.offer?.discountAmount ?? this.model.servicePriceOriginal - (this.model.servicePriceOriginal * ((this.offer?.percentageDiscount ?? 0) / 100));
        this.model['serviceThumbnail'] = this.offer?.service?.thumbnailImageUrl ? this.offer.service.thumbnailImageUrl : 'assets/img/img-placeholder.png';
        this.model['serviceDescription'] = this.offer?.service?.description;
        this.model['offerSoldCount'] = this.offer?.soldCount ?? 0;
        this.model['offerUnits'] = this.offer?.unitLimit ?? 0;
        this.model['offerDuration'] = getDuration();
        this.model['offerAvailableUnits'] = this.offer?.unitLimit - this.offer?.soldCount;
        this.model['offerLaunched'] = this.convertMomentToShorterDateFormat(this.offer?.launchedTime);
        this.model['offerEnded'] = this.convertMomentToShorterDateFormat(this.offer?.endedTime);
        this.getRemainingTime();

        const purchase = this.purchases?.find(p => p.userId === this.appSession.userId);
        this.model['offerPurchasedDate'] = this.convertMomentToShorterDateFormat(purchase?.creationTime);
        this.isLoadingInitialData$.next(false);
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

    onEditClick(): void {
        const modalSettings = this.defaultModalSettings as ModalOptions<CreateOfferComponent>;
        modalSettings.class = 'modal-lg modal-dialog-centered';
        modalSettings.initialState = {
            model: CreateServiceOfferDto.fromJS({
                ...this.offer,
                unitLimit: this.offer.unitLimit === null ? undefined : this.offer.unitLimit,
                percentageDiscount: this.offer.percentageDiscount === null ? undefined : this.offer.percentageDiscount,
            }),
            referenceId: this.offer.referenceId,
            selectedService: this.offer.service
        };
        const modal = this._modalService.show(CreateOfferComponent, modalSettings);
        modal.content.onSave.subscribe(() => this.onBack.next());
    }

    async onLaunchClick(id?: string) {
        this.isSubmitting$.next(true);
        await this._servicesService.launchOffer(id ?? this.offer.id).toPromise();
        this.isSubmitting$.next(false);
        this.onBack.next();
    }

    async onRelaunchClick() {
        const modalSettings = this.defaultModalSettings as ModalOptions<CreateOfferComponent>;
        modalSettings.class = 'modal-lg modal-dialog-centered';
        modalSettings.initialState = {
            model: CreateServiceOfferDto.fromJS({
                ...this.offer,
                id: null,
                status: ServiceOfferStatus.Queued,
                unitLimit: this.offer.unitLimit === null ? undefined : this.offer.unitLimit,
                percentageDiscount: this.offer.percentageDiscount === null ? undefined : this.offer.percentageDiscount,
            }),
            referenceId: this.offer.referenceId,
            selectedService: this.offer.service
        };
        const modal = this._modalService.show(CreateOfferComponent, modalSettings);
        modal.content.onSave.subscribe(async (offer) => this.onLaunchClick(offer.id));
    }

    async onCloseClick() {
        this.isSubmitting$.next(true);
        await this._servicesService.closeOffer(this.offer.id).toPromise();
        this.isSubmitting$.next(false);
        this.onBack.next();
    }

    onBackClick(): void {
        this.onBack.next();
    }

    onLearnClick(): void {
        const url = `${AppConsts.appBaseUrl}/app/events/${this.offer.serviceId}/about`;
        window.open(url, '_blank');
    }

    onPurchaseClick(): void {
        const modalSettings = this.defaultModalSettings as ModalOptions<PurchaseComponent>;
        modalSettings.class = 'modal-lg modal-dialog-centered';
        modalSettings.initialState = { offer: this.offer };
        this._modalService.show(PurchaseComponent, modalSettings);
    }
}
