import { Component, Injector, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { AppComponentBase } from '@shared/app-component-base';
import { ShimmerType } from '@shared/enums/shimmer/shimmer-type.enum';
import { LandingPagesService } from '@shared/services/landing-pages.service';
import { ServiceDataService } from '@shared/services/service-data.service';
import { CourseDto, NotificationDto, RatingExperienceType, ServiceRatingDto, ServiceReviewDto, ServicesServiceProxy } from '@shared/service-proxies/service-proxies';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.less']
})
export class EventReviewsComponent extends AppComponentBase implements OnInit {
  data: CourseDto;
  shimmerType = ShimmerType;
  reviews: ServiceReviewDto[];

  notificationId: string;
  notification: NotificationDto;

  constructor(
    injector: Injector,
    private _route: ActivatedRoute,
    private _landingPageService: LandingPagesService,
    private _serviceData: ServiceDataService,
    private _servicesService: ServicesServiceProxy
  ) {
    super(injector);
  }

  get serviceId(): string { return this.data?.id; }
  get isLoading$() { return this._landingPageService.isLoading$; }
  get hasReviewed(): boolean { return this.data?.hasReviewed; }
  get isPurchased(): boolean { return this.data?.isPurchased; }
  get totalReviews(): number { return this.reviews?.length ?? 0; }

  ngOnInit(): void {
    this._route.queryParamMap
    .pipe(debounceTime(100)) // debounced so that params and query params have time to trigger their events
    .pipe(distinctUntilChanged()) // values should be distinct to avoid unnecessary calls
    .pipe(takeUntil(this.destroyed$))
    .subscribe(async query => {
        this.notificationId = query.get('n');
        this._serviceData.serviceData$.pipe(takeUntil(this.destroyed$)).subscribe(data => {
          this.data = data;
          this.getServiceReviews();
        });
    },
    (err) => {
      console.error(`Error occurred while loading the discussion: ${err}`);
    });
  }

  onReviewSuccess(): void {
    this._servicesService.getServiceReviewStats(this.serviceId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(stats => {
        this._serviceData.serviceReviewStats = stats;
      });
  }

  private getServiceReviews(): void {
    this._servicesService.getServiceReviews(this.serviceId, this.notificationId ?? undefined)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(reviews => {
        this.reviews = reviews;
        setTimeout(() => this.scrollToMiddleHighlightedComment());
      });
  }
}
