import { Component, Injector, Input, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ShimmerType } from '@shared/enums/shimmer/shimmer-type.enum';
import { LandingPagesService } from '@shared/services/landing-pages.service';
import {
  CourseDto,
  CourseRatingDto,
  RatingExperienceType,
  RatingsServiceProxy,
} from '@shared/service-proxies/service-proxies';
import { ServiceDataService } from '@shared/services/service-data.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.less']
})
export class CourseReviewsComponent extends AppComponentBase implements OnInit {
  data: CourseDto;
  shimmerType = ShimmerType;

  RatingExperienceType = RatingExperienceType;
  courseRating: CourseRatingDto[];

  constructor(
    injector: Injector,
    private _landingPageService: LandingPagesService,
    private _ratingsService: RatingsServiceProxy,
    private _serviceData: ServiceDataService
  ) {
    super(injector);
  }

  get isLoading$() { return this._landingPageService.isLoading$; }
  get tutorId(): number { return this.data?.creatorUser?.id; }
  get totalReview(): number { return this.courseRating?.length; }

  ngOnInit(): void {
    this._serviceData.serviceData$.pipe(takeUntil(this.destroyed$)).subscribe(d => {
      if (d) {
        this.data = d;
        this.getCourseRatings();
      }
    });
  }

  private getCourseRatings(): void {
    this._ratingsService.getCourseRatings(this.data?.id, undefined, undefined)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((result): void => {
        this.courseRating = result.items;
      });
  }
}
