import { Component, Injector, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { finalize, takeUntil } from 'rxjs/operators';

import { AppComponentBase } from '@shared/app-component-base';
import { ShimmerType } from '@shared/enums/shimmer/shimmer-type.enum';
import { LandingPagesService } from '@shared/services/landing-pages.service';
import { ServiceDataService } from '@shared/services/service-data.service';
import { CourseDto, CourseRatingSummaryDto, RatingsServiceProxy } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-review-stats',
  templateUrl: './review-stats.component.html',
  styleUrls: ['./review-stats.component.less']
})
export class ReviewStatsComponent extends AppComponentBase implements OnInit, OnChanges {
  shimmerType = ShimmerType;
  courseRatingSummary: CourseRatingSummaryDto;
  isSummaryLoading: boolean;

  @Input() data: CourseDto;

  constructor(
    injector: Injector,
    private _landingPageService: LandingPagesService,
    private _serviceData: ServiceDataService,
    private _ratingsService: RatingsServiceProxy
  ) {
    super(injector);
  }

  get isLoading$() { return this._landingPageService.isLoading$; }
  get tutorId(): number { return this.data?.creatorUser?.id; }
  get communicationRatings(): number { return this.courseRatingSummary?.totalCommunicationRatings; }
  get valueForMoneyRatings(): number { return this.courseRatingSummary?.totalValueForMoneyRatings; }
  get punctualityRatings(): number { return this.courseRatingSummary?.totalPunctualityRatings; }

  ngOnInit(): void {
    this._serviceData.serviceData$.pipe(takeUntil(this.destroyed$)).subscribe(d => this.data = d);
  }

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
