import { Component, Injector, Input, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ShimmerType } from '@shared/enums/shimmer/shimmer-type.enum';
import { LandingPagesService } from '@shared/services/landing-pages.service';
import { ServiceReviewDto, ServiceReviewStats } from '@shared/service-proxies/service-proxies';
import { ServiceDataService } from '@shared/services/service-data.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-service-review-stats',
  templateUrl: './service-review-stats.component.html',
  styleUrls: ['./service-review-stats.component.less']
})
export class ServiceReviewStatsComponent extends AppComponentBase implements OnInit {
  @Input() hasBorders = true;

  data: ServiceReviewStats;
  shimmerType = ShimmerType;

  constructor(
    injector: Injector,
    private _landingPageService: LandingPagesService,
    private _serviceData: ServiceDataService
  ) {
    super(injector);
  }

  get isLoading$() { return this._landingPageService.isLoading$; }
  get totalReviews(): number { return this.data?.totalReviews; }
  get fiveStars(): number { return this.data?.fiveStars; }
  get fourStars(): number { return this.data?.fourStars; }
  get threeStars(): number { return this.data?.threeStars; }
  get twoStars(): number { return this.data?.twoStars; }
  get oneStars(): number { return this.data?.oneStars; }
  get overallRatings(): number { return this.data?.overallRatings; }

  ngOnInit(): void {
    this.data = this._serviceData.getServiceReviewStatsValue();
    this._serviceData.serviceReviewStats$.pipe(takeUntil(this.destroyed$)).subscribe(x => this.data = x);
  }
}
