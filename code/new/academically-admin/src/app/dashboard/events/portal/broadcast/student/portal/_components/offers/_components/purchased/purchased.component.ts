import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ServiceOfferDto } from '@shared/service-proxies/service-proxies';
import { ServiceOffersService } from '@shared/services/service-offers.service';
import * as moment from 'moment';

@Component({
  selector: 'app-purchased',
  templateUrl: './purchased.component.html',
  styleUrls: ['./purchased.component.less']
})
export class PurchasedComponent extends AppComponentBase implements OnInit {
  offers: ServiceOfferDto[];

  constructor(
    injector: Injector,
    private _serviceOffersService: ServiceOffersService
  ) {
    super(injector);
  }

  ngOnInit(): void {

  }

  onOfferClick(offer: ServiceOfferDto): void {
    this._serviceOffersService.selectServiceOffer(offer);
  }
}
