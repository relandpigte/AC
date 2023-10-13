import { ChangeDetectorRef, Component, EventEmitter, Injector, OnInit, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ServicePickerComponent } from '@shared/components/service-picker/service-picker.component';
import { ServiceCardUtils } from '@shared/helpers/service-card-utils';
import { ServiceOffersService } from '@shared/services/service-offers.service';
import { AvailableServiceDto, CreateServiceOfferDto, ServiceOfferDto, ServicesServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, combineLatest, of } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'app-create-offer',
    templateUrl: './create-offer.component.html',
    styleUrls: ['./create-offer.component.less']
})
export class CreateOfferComponent extends AppComponentBase implements OnInit {
    model = new CreateServiceOfferDto();

    referenceId: string;
    selectedService: AvailableServiceDto;

    percentageOptions = [
        { value: 0, label: '0%' },
        { value: 10, label: '10%' },
        { value: 20, label: '20%' },
        { value: 30, label: '30%' },
        { value: 40, label: '40%' },
        { value: 50, label: '50%' },
        { value: 60, label: '60%' },
        { value: 70, label: '70%' },
        { value: 80, label: '80%' },
        { value: 90, label: '90%' },
        { value: 100, label: '100%' },
    ];

    isCreateAnotherOffer = false;
    isLoadingList$ = new BehaviorSubject<boolean>(false);
    isSubmitting$ = new BehaviorSubject<boolean>(false);

    @ViewChild(NgForm) serviceOfferForm: NgForm;

    @Output() onSave = new EventEmitter<ServiceOfferDto>();

    constructor(
        injector: Injector,
        private _cdr: ChangeDetectorRef,
        private _modal: BsModalRef,
        private _modalService: BsModalService,
        private _serviceOffersService: ServiceOffersService,
        private _servicesService: ServicesServiceProxy
    ) {
        super(injector);
    }

    get isLoading$() { return combineLatest([this.isLoadingList$, this.isSubmitting$]).pipe(switchMap((loaders) => of(loaders.some(l => l)))); }
    get isPriceInput() { return this.model.percentageDiscount === undefined; }
    get isPriceDiscount() { return this.model.percentageDiscount !== undefined; }
    get hasSelectedService() { return !!this.selectedService; }

    get serviceThumbnail() { return this.selectedService.thumbnailImageUrl ? this.selectedService.thumbnailImageUrl : 'assets/img/img-placeholder.png'; }
    get serviceTitle() { return this.selectedService.name; }
    get serviceType() { return ServiceCardUtils.getServiceTypeName(this.selectedService.serviceType); }
    get servicePrice() { return this.selectedService?.price ?? 0; }
    get validMaxDiscountPrice() { return this.servicePrice ?? 0; }

    async ngOnInit() {
    }

    onCloseClick(): void {
        this._modal.hide();
    }

    async onFormSubmit() {
        let upserted: ServiceOfferDto = null;
        this.isSubmitting$.next(true);
        try {
            upserted = await this._servicesService.upsertServiceOffer(CreateServiceOfferDto.fromJS({
                ...this.model,
                referenceId: this.referenceId,
                serviceId: this.selectedService.id,
            })).toPromise();

            this._serviceOffersService.hasNewServiceOffer(upserted);
        } catch (err) {
            console.error(err);
        }
        this.isSubmitting$.next(false);

        if (this.isCreateAnotherOffer) {
            this.model = new CreateServiceOfferDto();
            this.selectedService = undefined;
            this.serviceOfferForm.resetForm();
            setTimeout(() => {
                this.model.discountAmount = 0;
                this.model.percentageDiscount = undefined;
                this.isCreateAnotherOffer = true;
            });
        } else {
            this._modal.hide();
        }

        this.onSave.emit(upserted);
    }

    onSelectServiceClick(): void {
        const modalSettings = this.defaultModalSettings as ModalOptions<ServicePickerComponent>;
        modalSettings.class = 'modal-md modal-dialog-centered';
        modalSettings.initialState = {
            title: 'Select a service',
            searchPlaceholder: 'Search the service you would like to offer',
            isShowBack: false,
            isStandalone: true,
            addLabel: 'Select',
            selectedService: this.selectedService
        };

        const modal = this._modalService.show(ServicePickerComponent, modalSettings);
        modal.content.onClose.pipe(takeUntil(this.destroyed$))
            .subscribe(() => {
                modal.hide();
            })

        modal.content.onAdd.pipe(takeUntil(this.destroyed$))
            .subscribe(service => {
                this.selectedService = service;
                modal.hide();
            })
    }

    onAmountTypeClick(type: number): void {
        if (type === 0) {
            this.model.discountAmount = null;
            this.model.percentageDiscount = undefined;
        } else {
            this.model.discountAmount = undefined;
            this.model.percentageDiscount = null;
        }
        this._cdr.detectChanges();
    }
}
