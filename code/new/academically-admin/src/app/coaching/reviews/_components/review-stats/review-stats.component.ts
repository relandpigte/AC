import { Component, Injector, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { finalize, takeUntil } from 'rxjs/operators';

import { AppComponentBase } from '@shared/app-component-base';
import { ShimmerType } from '@shared/enums/shimmer/shimmer-type.enum';
import { LandingPagesService } from '@shared/services/landing-pages.service';
import { ServiceDataService } from '@shared/services/service-data.service';
import { CoachingDto, RatingsServiceProxy, ServiceRatingSummaryDto } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-review-stats',
  templateUrl: './review-stats.component.html',
  styleUrls: ['./review-stats.component.less']
})
export class ReviewStatsComponent extends AppComponentBase implements OnInit, OnChanges {
  shimmerType = ShimmerType;
  coachingRatingSummary: ServiceRatingSummaryDto;
  isSummaryLoading: boolean;

  @Input() data: CoachingDto;

  constructor(
    injector: Injector,
    private _landingPageService: LandingPagesService,
    private _serviceData: ServiceDataService,
    private _ratingsService: RatingsServiceProxy
  ) {
    super(injector);
  }

  get isLoading$() { return this._landingPageService.isLoading$; }
  get serviceId(): string { return this.data?.id; }
  get totalCommunicationRatings(): number { return this.coachingRatingSummary?.totalCommunicationRatings; }
  get totalValueForMoneyRatings(): number { return this.coachingRatingSummary?.totalValueForMoneyRatings; }
  get totalPunctualityRatings(): number { return this.coachingRatingSummary?.totalPunctualityRatings; }
  get totalProfessionalismsRating(): number { return this.coachingRatingSummary?.totalProfessionalismsRating; }
  get totalKnowledgeRatings(): number { return this.coachingRatingSummary?.totalKnowledgeRatings; }
  get totalRatingPercentage(): number { return this.coachingRatingSummary?.totalRatingPercentage; }
  get totalReviews(): number { return this.coachingRatingSummary?.totalReviews; }
  get totalPositiveReviews(): number { return this.coachingRatingSummary?.totalPositiveReviews; }
  get totalNeutralReviews(): number { return this.coachingRatingSummary?.totalNeutralReviews; }
  get totalNegativeReviews(): number { return this.coachingRatingSummary?.totalNegativeReviews; }
  get positivePercentage(): number { return this.coachingRatingSummary?.positivePercentage; }

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
    this._ratingsService.getServiceRatingsSummary(this.serviceId)
      .pipe(takeUntil(this.destroyed$))
      .pipe(finalize(() => this.isSummaryLoading = false))
      .subscribe(rating => {
        this.coachingRatingSummary = rating;
      });
  }
}
