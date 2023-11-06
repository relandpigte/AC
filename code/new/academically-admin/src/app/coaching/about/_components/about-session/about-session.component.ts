import { Component, Injector, Input, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';

import { ShimmerType } from '@shared/enums/shimmer/shimmer-type.enum';
import { LandingPagesService } from '@shared/services/landing-pages.service';
import { AppComponentBase } from '@shared/app-component-base';
import { ServiceDataService } from '@shared/services/service-data.service';
import { CoachingDto, ServiceRatingSummaryDto } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-about-session',
  templateUrl: './about-session.component.html',
  styleUrls: ['./about-session.component.less']
})
export class AboutSessionComponent extends AppComponentBase implements OnInit {
  @Input() data: CoachingDto;

  shimmerType = ShimmerType;
  coachingRatingSummary: ServiceRatingSummaryDto;

  constructor(
    injector: Injector,
    private _serviceData: ServiceDataService,
    private _landingPageService: LandingPagesService
  ) {
    super(injector);
  }

  get isLoading$() { return this._landingPageService.isLoading$; }
  get description(): string { return this.data?.description; }
  get serviceId(): string { return this.data?.id; }
  get totalRatingPercentage(): number { return this.coachingRatingSummary?.totalRatingPercentage; }

  ngOnInit(): void {
    this._serviceData.serviceOverallRating$.pipe(takeUntil(this.destroyed$)).subscribe(rating => this.coachingRatingSummary = rating);
  }
}
