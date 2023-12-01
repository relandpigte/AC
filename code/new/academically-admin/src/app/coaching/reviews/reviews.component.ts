import { Component, Injector, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';

import { AppComponentBase } from '@shared/app-component-base';
import { ShimmerType } from '@shared/enums/shimmer/shimmer-type.enum';
import { ServiceDataService } from '@shared/services/service-data.service';
import { LandingPagesService } from '@shared/services/landing-pages.service';
import { CoachingDto, ServiceReviewDto, ServicesServiceProxy } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.less']
})
export class CoachingReviewsComponent extends AppComponentBase implements OnInit {
  data: CoachingDto;
  shimmerType = ShimmerType;
  reviews: ServiceReviewDto[];
  totalReviews: number;

  constructor(
    injector: Injector,
    private _landingPageService: LandingPagesService,
    private _serviceData: ServiceDataService,
    private _servicesService: ServicesServiceProxy
  ) {
    super(injector);
  }

  get isLoading$() { return this._landingPageService.isLoading$; }
  get serviceId(): string { return this.data?.id; }
  get hasReviewed(): boolean { return this.data?.hasReviewed; }
  get isPurchased(): boolean { return this.data?.isPurchased; }

  ngOnInit(): void {
    this._serviceData.serviceData$.pipe(takeUntil(this.destroyed$)).subscribe(data => {
      this.data = data;
      this.getServiceReviews();
    });
  }

  private getServiceReviews(): void {
    this._servicesService.getServiceReviews(this.serviceId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(reviews => {
        this.reviews = reviews;
        this.totalReviews = reviews?.length ?? 0;
      });
  }
}
