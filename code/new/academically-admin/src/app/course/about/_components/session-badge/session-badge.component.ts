import { Component, Injector, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { finalize, takeUntil } from 'rxjs/operators';

import { AppComponentBase } from '@shared/app-component-base';
import { ShimmerType } from '@shared/enums/shimmer/shimmer-type.enum';
import { LandingPagesService } from '@shared/services/landing-pages.service';
import { CourseDto, CourseRatingSummaryDto, RatingsServiceProxy } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-session-badge',
  templateUrl: './session-badge.component.html',
  styleUrls: ['./session-badge.component.less']
})
export class SessionBadgeComponent extends AppComponentBase implements OnInit, OnChanges {
  @Input() data: CourseDto;

  shimmerType = ShimmerType;
  courseRatingSummary: CourseRatingSummaryDto;
  isSummaryLoading: boolean;

  constructor(
    injector: Injector,
    private _ratingsService: RatingsServiceProxy,
    private _landingPageService: LandingPagesService
  ) {
    super(injector);
  }

  get isLoading$() { return this._landingPageService.isLoading$; }
  get description(): string { return this.data?.description; }
  get modules(): number { return this.data?.modules; }
  get lessons(): number { return this.data?.lessons; }
  get ratingPercentage(): number { return this.courseRatingSummary?.totalRatingPercentage; }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if ('data' in changes && this.data) {
      this.getRatingSummary();
    }
  }

  private getRatingSummary(): void {
    this.isSummaryLoading = true;
    this._ratingsService.getCourseRatingSummary(this.data?.id)
      .pipe(takeUntil(this.destroyed$))
      .pipe(finalize(() => this.isSummaryLoading = false))
      .subscribe(rating => {
        this.courseRatingSummary = rating;
      });
  }
}
