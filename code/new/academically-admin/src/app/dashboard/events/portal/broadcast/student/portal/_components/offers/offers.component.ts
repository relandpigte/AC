import { Component, OnInit, Injector, Input } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { PortalService } from '../../_services/portal.service';
import { takeUntil } from 'rxjs/operators';
import { ServiceOfferDto, ServicesServiceProxy } from '@shared/service-proxies/service-proxies';
import { ServiceOffersService } from '@shared/services/service-offers.service';
import { ServiceOffersStateService, offersType } from '@shared/services/service-offers-state.service';
import { AppStateConfig, AppStateServices } from '@shared/services/pub-sub.service';
import { HubService } from '@app/_shared/services/hub.service';
import { StateUpdateType } from '@shared/services/state-base.service';

export enum OffersTabs { Queued, Open, Closed, Purchased }

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.less']
})
export class OffersComponent extends AppComponentBase implements OnInit {
  offersStateService: ServiceOffersStateService;
  @Input() referenceId: string;

  isHost = false;

  selectedOffer: ServiceOfferDto;
  activeTab: OffersTabs;

  OffersTabs = OffersTabs;

  constructor(
    injector: Injector,
    private _serviceOffersService: ServiceOffersService,
    private _portalService: PortalService,
    private _hubService: HubService,
    private _servicesService: ServicesServiceProxy,
  ) {
    super(injector);
    this._portalService.event$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        this.isHost = response.creatorUserId === this.appSession.userId;
        this.activeTab = this.isHost ? OffersTabs.Queued : OffersTabs.Open;
      });

    this._serviceOffersService.selectedServiceOffer$
      .subscribe(offer => this.selectedOffer = offer);
  }

  get offersStateId(): string { return 'offers-event'; }

  async ngOnInit() {
    await this.initOffersAppStates();
  }

  private async initOffersAppStates() {
    const appStateConfig: AppStateConfig = {
      [this.offersStateId]: {
        update: { referenceId: this.referenceId }
      }
    };
    const appStateServices: AppStateServices = {
      [this.offersStateId]: {
        type: ServiceOffersStateService,
        args: [offersType.all, this.appSession, this._hubService, this._servicesService]
      }
    };
    await this.pubSubService.start(this, appStateConfig, appStateServices);
    this.offersStateService = this.pubSubService.getStateService<ServiceOffersStateService>(this.offersStateId);
    this.offersStateService.offers$.pipe(takeUntil(this.destroyed$)).subscribe(event => {
      if (this.selectedOffer?.id === event?.data?.id) {
        this._serviceOffersService.selectServiceOffer(event.data);
      }
    });
  }

  onTabChange(tab: OffersTabs): void {
    this._serviceOffersService.selectServiceOffer(null);
    this.activeTab = tab;
  }

  onClearSelectedOffer(): void {
    this._serviceOffersService.selectServiceOffer(null);
  }

}
