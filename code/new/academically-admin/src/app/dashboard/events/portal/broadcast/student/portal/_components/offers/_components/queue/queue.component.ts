import { Component, Injector, Input, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ServiceOfferDto, ServiceOfferStatus, ServicesServiceProxy } from '@shared/service-proxies/service-proxies';
import * as moment from 'moment';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { CreateOfferComponent } from '../create-offer/create-offer.component';
import { ServiceOffersService } from '@shared/services/service-offers.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-queue',
  templateUrl: './queue.component.html',
  styleUrls: ['./queue.component.less']
})
export class QueueComponent extends AppComponentBase implements OnInit {
  @Input() referenceId: string;

  offers: ServiceOfferDto[];
  isLoadingList$ = new BehaviorSubject<boolean>(true);

  constructor(
    injector: Injector,
    private _bsModalService: BsModalService,
    private _serviceOffersService: ServiceOffersService,
    private _servicesService: ServicesServiceProxy
  ) {
    super(injector);

    this._serviceOffersService.newServiceOffer$
      .subscribe(newServiceOffer => this.offers = [newServiceOffer, ...this.offers]);
  }

  get loadingSources$() { return [ this.isLoadingList$ ]; }

  async ngOnInit() {
    await this.getAllServiceOffers();
  }

  private async getAllServiceOffers() {
    this.isLoadingList$.next(true);
    try {
      this.offers = await this._servicesService.getServiceOffers(this.referenceId, ServiceOfferStatus.Queued).toPromise();
    } catch (err) {
      console.error(err);
    }
    this.isLoadingList$.next(false);
  }

  onNewOfferClick(): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<CreateOfferComponent>;
    modalSettings.class = 'modal-lg modal-dialog-centered';
    modalSettings.initialState = { referenceId: this.referenceId };
    this._bsModalService.show(CreateOfferComponent, modalSettings);
  }

}
