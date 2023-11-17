import { ChangeDetectorRef, Component, Injector, Input, OnDestroy, OnInit } from '@angular/core';
import { HubService } from '@app/_shared/services/hub.service';
import { AppComponentBase } from '@shared/app-component-base';
import { ServiceOfferDto, ServiceOfferStatus, ServicesServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppStateConfig, AppStateServices } from '@shared/services/pub-sub.service';
import { ServiceOffersStateService, offersType } from '@shared/services/service-offers-state.service';
import { StateUpdateType } from '@shared/services/state-base.service';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CreateOfferComponent } from '../create-offer/create-offer.component';
import { ServiceOffersService } from '@shared/services/service-offers.service';

@Component({
  selector: 'app-queue',
  templateUrl: './queue.component.html',
  styleUrls: ['./queue.component.less']
})
export class QueueComponent extends AppComponentBase implements OnInit, OnDestroy {
  offersStateService: ServiceOffersStateService;
  @Input() referenceId: string;
  @Input() isHost = false;

  offers: ServiceOfferDto[];
  totalOffersCount = 0;
  isLoadingList$ = new BehaviorSubject<boolean>(true);

  constructor(
    injector: Injector,
    private _cdr: ChangeDetectorRef,
    private _hubService: HubService,
    private _bsModalService: BsModalService,
    private _servicesService: ServicesServiceProxy,
    private _serviceOffersService: ServiceOffersService
  ) {
    super(injector);
  }

  get offersStateId(): string { return 'offers-queued'; }
  get loadingSources$() { return [ this.isLoadingList$ ]; }

  async ngOnInit() {
    await this.initOffersAppStates();
  }

  async ngOnDestroy() {
    await this.offersStateService?.stop();
  }

  private async initOffersAppStates() {
    const appStateConfig: AppStateConfig = {
      [this.offersStateId]: {
        load: [this.referenceId, ServiceOfferStatus.Queued],
        update: { referenceId: this.referenceId }
      }
    };
    const appStateServices: AppStateServices = {
      [this.offersStateId]: {
        type: ServiceOffersStateService,
        args: [offersType.queued, this.appSession, this._hubService, this._servicesService]
      }
    };
    await this.pubSubService.start(this, appStateConfig, appStateServices);
    this.offersStateService = this.pubSubService.getStateService<ServiceOffersStateService>(this.offersStateId);
    this.offersStateService.loading$.pipe(takeUntil(this.destroyed$)).subscribe(loading => this.isLoadingList$.next(loading));
    this.offersStateService.offers$.pipe(takeUntil(this.destroyed$)).subscribe(event => {
      switch (event.type) {
        case StateUpdateType.Add:
          this.offers = [event.data].concat(this.offers);
          this.totalOffersCount++;
          break;
        case StateUpdateType.Update:
          if (event.silent) {
            this.offers = this.offers.map(c => c.id === event.data.id ? event.data : c);
          } else {
            const idx = this.offers.findIndex(c => c.id === event.data.id);
            this.offers.splice(idx, 1);
            this.offers = [event.data].concat(this.offers);
          }
          break;
        case StateUpdateType.Delete:
          this.offers = this.offers.filter(c => c.id != event.data.id);
          this.totalOffersCount--;
          break;
      }
      this._cdr.detectChanges();
    });
    this.offers = this.offersStateService.getAllOffers();
    this.totalOffersCount = this.offersStateService.totalOffersCount;
  }

  onOfferClick(offer: ServiceOfferDto): void {
    this._serviceOffersService.selectServiceOffer(offer);
  }

  onNewOfferClick(): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<CreateOfferComponent>;
    modalSettings.class = 'modal-lg modal-dialog-centered';
    modalSettings.initialState = { referenceId: this.referenceId };
    this._bsModalService.show(CreateOfferComponent, modalSettings);
  }

}
