import { Component, Injector, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';

import { AppComponentBase } from '@shared/app-component-base';
import { ShimmerType } from '@shared/enums/shimmer/shimmer-type.enum';
import { LandingPagesService } from '@shared/services/landing-pages.service';
import { ServiceDataService } from '@shared/services/service-data.service';
import { CourseDto, RatingExperienceType, ServiceRatingDto, ServiceReviewDto, ServicesServiceProxy } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.less']
})
export class CourseReviewsComponent extends AppComponentBase implements OnInit {
  data: CourseDto;
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

  get serviceId(): string { return this.data?.id; }
  get isLoading$() { return this._landingPageService.isLoading$; }
  get hasReviewed(): boolean { return this.data?.hasReviewed; }
  get isCompleted(): boolean { return this.data?.progress === 100; }

  ngOnInit(): void {
    this._serviceData.serviceData$.pipe(takeUntil(this.destroyed$)).subscribe(d => {
      this.data = d;
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
