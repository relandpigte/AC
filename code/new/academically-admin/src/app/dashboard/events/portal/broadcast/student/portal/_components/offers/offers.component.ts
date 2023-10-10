import { Component, OnInit, Injector, Input } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { PortalService } from '../../_services/portal.service';
import { takeUntil } from 'rxjs/operators';
import { ServiceOfferDto } from '@shared/service-proxies/service-proxies';
import { ServiceOffersService } from '@shared/services/service-offers.service';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.less']
})
export class OffersComponent extends AppComponentBase implements OnInit {
  @Input() referenceId: string;

  isHost = false;

  selectedOffer: ServiceOfferDto;

  constructor(
    injector: Injector,
    private _serviceOffersService: ServiceOffersService,
    private _portalService: PortalService,
  ) {
    super(injector);
    this._portalService.event$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        this.isHost = response.creatorUserId === this.appSession.userId;
      });

    this._serviceOffersService.selectedServiceOffer$
      .subscribe(offer => this.selectedOffer = offer);
  }

  ngOnInit(): void {
  }

  onClearSelectedOffer(): void {
    this._serviceOffersService.selectServiceOffer(null);
  }

}
