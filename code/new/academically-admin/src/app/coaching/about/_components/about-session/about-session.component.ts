import { Component, Injector, Input, OnChanges, SimpleChanges } from '@angular/core';
import { finalize, takeUntil } from 'rxjs/operators';

import { ShimmerType } from '@shared/enums/shimmer/shimmer-type.enum';
import { LandingPagesService } from '@shared/services/landing-pages.service';
import { AppComponentBase } from '@shared/app-component-base';
import { CoachingDto, RatingsServiceProxy, ServiceRatingSummaryDto } from '@shared/service-proxies/service-proxies';
import {  } from '@node_modules/@angular/core';

@Component({
  selector: 'app-about-session',
  templateUrl: './about-session.component.html',
  styleUrls: ['./about-session.component.less']
})
export class AboutSessionComponent extends AppComponentBase implements OnChanges {
  @Input() data: CoachingDto;

  shimmerType = ShimmerType;
  coachingRatingSummary: ServiceRatingSummaryDto;
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
  get serviceId(): string { return this.data?.id; }
  get totalRatingPercentage(): number { return this.coachingRatingSummary?.totalRatingPercentage; }

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
