import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ServiceCardUtils } from '@shared/helpers/service-card-utils';
import { CreateServiceOfferDto, ServiceOfferDto, ServiceOfferStatus, ServicesServiceProxy } from '@shared/service-proxies/service-proxies';
import { ServiceOffersService } from '@shared/services/service-offers.service';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { CreateOfferComponent } from '../create-offer/create-offer.component';
import { BehaviorSubject, combineLatest, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
    selector: 'app-offer-details',
    templateUrl: './offer-details.component.html',
    styleUrls: ['./offer-details.component.less']
})
export class OfferDetailsComponent extends AppComponentBase implements OnInit {
    @Input() offer: ServiceOfferDto;
    @Input() isHost = false;
    @Output() onBack = new EventEmitter<void>();

    isDescriptionExpanded = false;
    isSubmitting$ = new BehaviorSubject<boolean>(false);

    model: any = {};

    ServiceOfferStatus = ServiceOfferStatus;

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

    get offerStatus(): ServiceOfferStatus { return this.offer?.status;}
    get canEdit(): boolean { return this.offer?.status === ServiceOfferStatus.Queued; }
    get isLoading$() { return combineLatest([this.isSubmitting$]).pipe(switchMap((loaders) => of(loaders.some(l => l)))); }

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

    async onLaunchClick() {
        this.isSubmitting$.next(true);
        await this._servicesService.launchOffer(this.offer.id).toPromise();
        this.isSubmitting$.next(false);
        this.onBack.next();
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
}
