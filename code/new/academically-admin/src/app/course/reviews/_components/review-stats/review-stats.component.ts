import { Component, Injector, Input, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';

import { AppComponentBase } from '@shared/app-component-base';
import { ShimmerType } from '@shared/enums/shimmer/shimmer-type.enum';
import { LandingPagesService } from '@shared/services/landing-pages.service';
import { ServiceDataService } from '@shared/services/service-data.service';
import { CourseDto, ServiceRatingSummaryDto } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-review-stats',
  templateUrl: './review-stats.component.html',
  styleUrls: ['./review-stats.component.less']
})
export class ReviewStatsComponent extends AppComponentBase implements OnInit {
  shimmerType = ShimmerType;
  courseRatingSummary: ServiceRatingSummaryDto;

  @Input() data: CourseDto;

  constructor(
    injector: Injector,
    private _landingPageService: LandingPagesService,
    private _serviceData: ServiceDataService,
  ) {
    super(injector);
  }

  get isLoading$() { return this._landingPageService.isLoading$; }
  get serviceId(): string { return this.data?.id; }
  get tutorId(): number { return this.data?.creatorUser?.id; }
  get totalCommunicationRatings(): number { return this.courseRatingSummary?.totalCommunicationRatings; }
  get totalValueForMoneyRatings(): number { return this.courseRatingSummary?.totalValueForMoneyRatings; }
  get totalPunctualityRatings(): number { return this.courseRatingSummary?.totalPunctualityRatings; }
  get totalProfessionalismsRating(): number { return this.courseRatingSummary?.totalProfessionalismsRating; }
  get totalKnowledgeRatings(): number { return this.courseRatingSummary?.totalKnowledgeRatings; }
  get totalRatingPercentage(): number { return this.courseRatingSummary?.totalRatingPercentage; }
  get totalReviews(): number { return this.courseRatingSummary?.totalReviews; }
  get totalPositiveReviews(): number { return this.courseRatingSummary?.totalPositiveReviews; }
  get totalNeutralReviews(): number { return this.courseRatingSummary?.totalNeutralReviews; }
  get totalNegativeReviews(): number { return this.courseRatingSummary?.totalNegativeReviews; }

  ngOnInit(): void {
    this._serviceData.serviceData$.pipe(takeUntil(this.destroyed$)).subscribe(d => this.data = d);
    this._serviceData.serviceOverallRating$.pipe(takeUntil(this.destroyed$)).subscribe(rating => this.courseRatingSummary = rating);
  }
}
