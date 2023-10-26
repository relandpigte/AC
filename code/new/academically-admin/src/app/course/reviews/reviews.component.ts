import { Component, Injector, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';

import { AppComponentBase } from '@shared/app-component-base';
import { ShimmerType } from '@shared/enums/shimmer/shimmer-type.enum';
import { LandingPagesService } from '@shared/services/landing-pages.service';
import { ServiceDataService } from '@shared/services/service-data.service';
import {
  CourseDto,
  RatingExperienceType,
  RatingsServiceProxy, ServiceRatingDto,
} from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.less']
})
export class CourseReviewsComponent extends AppComponentBase implements OnInit {
  data: CourseDto;
  shimmerType = ShimmerType;

  RatingExperienceType = RatingExperienceType;
  serviceRatings: ServiceRatingDto[];
  totalServiceRatings: number;

  constructor(
    injector: Injector,
    private _landingPageService: LandingPagesService,
    private _ratingsService: RatingsServiceProxy,
    private _serviceData: ServiceDataService
  ) {
    super(injector);
  }

  get courseId(): string { return this.data?.id; }
  get isLoading$() { return this._landingPageService.isLoading$; }
  get tutorId(): number { return this.data?.creatorUser?.id; }

  ngOnInit(): void {
    this._serviceData.serviceData$.pipe(takeUntil(this.destroyed$)).subscribe(d => {
      if (d) {
        this.data = d;
        this.getCourseRatings();
      }
    });
  }

  private getCourseRatings(): void {
    this._ratingsService.getServiceRatings(this.courseId, undefined, undefined)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((result): void => {
        this.serviceRatings = result.items;
        this.totalServiceRatings = result.totalCount;
      });
  }
}
