import { Component, Injector, Input, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ServiceOfferDto, ServicesServiceProxy } from '@shared/service-proxies/service-proxies';
import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-open',
  templateUrl: './open.component.html',
  styleUrls: ['./open.component.less']
})
export class OpenComponent extends AppComponentBase implements OnInit {
  @Input() referenceId: string;

  offers: ServiceOfferDto[];

  launched: boolean = false;

  isLoadingList$ = new BehaviorSubject<boolean>(true);

  constructor(
    injector: Injector,
    private _servicesService: ServicesServiceProxy
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
      this.offers = await this._servicesService.getServiceOffers(this.referenceId).toPromise();
    } catch (err) {
      console.error(err);
    }
    this.isLoadingList$.next(false);
  }

}
