import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { CreateServicePurchaseDto, ServicesServiceProxy } from '@shared/service-proxies/service-proxies';
import * as moment from 'moment';
import { finalize, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.less']
})
export class LandingPageComponent extends AppComponentBase implements OnInit {
  loading = false;
  id: string;

  constructor(
    injector: Injector,
    route: ActivatedRoute,
    private _router: Router,
    private _servicesService: ServicesServiceProxy,
  ) {
    super(injector);
    route.parent.parent.parent.paramMap.subscribe(paramMap => {
      if (paramMap.has('event-id')) {
        this.id = paramMap.get('event-id');
      }
    });
  }

  ngOnInit(): void {
  }

  onBuyNowClick(): void {
    this.loading = true;
    this._servicesService.savePurchase(CreateServicePurchaseDto.fromJS({
      referenceId: this.id,
      creatorUserId: this.appSession.userId,
      creationTime: moment()
    }))
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(() => {
        this._router.navigate([`/app/dashboard/events/portal/broadcast/student/${this.id}/portal`]);
      });
  }
}
