import { Component, Injector, Input, OnChanges, SimpleChanges } from '@angular/core';
import { takeUntil, finalize } from 'rxjs/operators';

import { AppComponentBase } from '@shared/app-component-base';
import { ShimmerType } from '@shared/enums/shimmer/shimmer-type.enum';
import { LandingPagesService } from '@shared/services/landing-pages.service';
import { CoachingDto, RatingsServiceProxy, ServiceRatingSummaryDto } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-session-badge',
  templateUrl: './session-badge.component.html',
  styleUrls: ['./session-badge.component.less']
})
export class SessionBadgeComponent extends AppComponentBase implements OnChanges {
  @Input() data: CoachingDto;

  readonly showMoreLimit: number = 255;

  showMore = false;
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

  get description(): string { return this.data?.description; }
  get profilePictureUrl(): string { return this.appSession.user.profilePictureUrl; }
  get profileFullName(): string { return `${this.appSession.user.name} ${this.appSession.user.surname}`; }
  get displayShowMore(): boolean { return this.description?.length > this.showMoreLimit; }
  get isLoading$() { return this._landingPageService.isLoading$; }
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
