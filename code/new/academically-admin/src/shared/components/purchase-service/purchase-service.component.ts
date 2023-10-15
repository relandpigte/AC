import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { CreateServicePurchaseDto, ServicePurchaseDto, ServicesServiceProxy, ServicesType } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, combineLatest, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ServiceCardUtils } from '@shared/helpers/service-card-utils';

@Component({
  selector: 'app-purchase-service',
  templateUrl: './purchase-service.component.html',
  styleUrls: ['./purchase-service.component.less']
})
export class PurchaseServiceComponent extends AppComponentBase implements OnInit {
  @Input() templateRef: any;
  @Input() serviceId: string;
  @Input() offerId: string;
  @Input() data: any;

  @Output() onPaid = new EventEmitter<ServicePurchaseDto>();

  isSubmitting$ = new BehaviorSubject<boolean>(false);

  model: any = {};

  constructor(
    injector: Injector,
    private _modal: BsModalRef,
    private _servicesService: ServicesServiceProxy
  ) {
    super(injector);
  }

  ngOnInit(): void {
  }

  get isLoading$() { return combineLatest([this.isSubmitting$]).pipe(switchMap((loaders) => of(loaders.some(l => l)))); }

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
        referenceId: this.serviceId,
        serviceOfferId: this.offerId,
        creatorUserId: this.appSession.userId,
        ownerId: this.data?.creatorUser?.id,
        type: ServicesType[ServiceCardUtils.getServiceType(this.data)]
      })).toPromise();
      this.onPaid.emit(purchase);
      this._modal.hide();
    } catch (err) {
      console.error(err);
    }
    this.isSubmitting$.next(false);
  }
}
