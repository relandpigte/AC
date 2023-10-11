import { Component, Injector, Input, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ServiceOfferDto, ServiceOfferStatus, ServicesServiceProxy } from '@shared/service-proxies/service-proxies';
import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import { CreateOfferComponent } from '../create-offer/create-offer.component';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ServiceOffersService } from '@shared/services/service-offers.service';

@Component({
  selector: 'app-closed',
  templateUrl: './closed.component.html',
  styleUrls: ['./closed.component.less']
})
export class ClosedComponent extends AppComponentBase implements OnInit {
  @Input() referenceId: string;
  offers: ServiceOfferDto[];
  isLoadingList$ = new BehaviorSubject<boolean>(true);

  constructor(
    injector: Injector,
    private _modalService: BsModalService,
    private _servicesService: ServicesServiceProxy,
    private _serviceOffersService: ServiceOffersService
  ) {
    super(injector);
  }

  get loadingSources$() { return [ this.isLoadingList$ ]; }

  async ngOnInit() {
    await this.getAllServiceOffers();
  }

  private async getAllServiceOffers() {
    this.isLoadingList$.next(true);
    try {
      this.offers = await this._servicesService.getServiceOffers(this.referenceId, ServiceOfferStatus.Closed).toPromise();
    } catch (err) {
      console.error(err);
    }
    this.isLoadingList$.next(false);
  }

  onOfferClick(offer: ServiceOfferDto): void {
    this._serviceOffersService.selectServiceOffer(offer);
  }

  onNewOfferClick(): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<CreateOfferComponent>;
    modalSettings.class = 'modal-lg modal-dialog-centered';
    modalSettings.initialState = { referenceId: this.referenceId };
    this._modalService.show(CreateOfferComponent, modalSettings);
  }

}
