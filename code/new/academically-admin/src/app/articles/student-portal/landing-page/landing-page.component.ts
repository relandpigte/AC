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
  id: string;
  isLoading = false;

  constructor(
    injector: Injector,
    private _route: ActivatedRoute,
    private _router: Router,
    private _servicesService: ServicesServiceProxy,
  ) {
    super(injector);
    this._route.parent.parent.parent.paramMap.subscribe(paramMap => {
      if (paramMap.has('article-id')) {
        this.id = paramMap.get('article-id');
      }
    });
  }

  ngOnInit(): void {
  }

  onBuyNowClick(): void {
    this._servicesService.savePurchase(CreateServicePurchaseDto.fromJS({
      referenceId: this.id,
      creatorUserId: this.appSession.userId,
      creationTime: moment()
    }))
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(() => {
        this._router.navigate([`/app/articles/student-portal/${this.id}/portal`]);
      });
  }
}
