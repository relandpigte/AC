import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ProfileMetricDto, ProfilesServiceProxy, TutorProfileMetricDto } from '@shared/service-proxies/service-proxies';
import { finalize, takeUntil } from '@node_modules/rxjs/operators';
import { ShimmerType } from '@shared/enums/shimmer/shimmer-type.enum';
import { DashboardPagesService } from '@shared/services/dashboard-pages.service';

@Component({
  selector: 'app-tutor-metrics',
  templateUrl: './tutor-metrics.component.html',
  styleUrls: ['./tutor-metrics.component.less']
})
export class TutorMetricsComponent extends AppComponentBase implements OnInit {
  profileMetric: TutorProfileMetricDto
  isLoading = false;

  shimmerType = ShimmerType;

  constructor(
    injector: Injector,
    private _dashboardPageService: DashboardPagesService,
    private _profilesServiceProxy: ProfilesServiceProxy
  ) {
    super(injector);
  }

  get isLoading$() { return this._dashboardPageService.isLoading$; }
  get serviceCreated(): number { return this.profileMetric?.serviceCreated; }
  get followers(): number { return this.profileMetric?.followers; }
  get positiveReviews(): number { return this.profileMetric?.positiveReviews; }
  get totalReviews(): number { return this.profileMetric?.totalReviews; }
  get totalRevenue(): string { return this.profileMetric?.totalRevenue?.toLocaleString(); }

  ngOnInit(): void {
    this.getMetrics();
  }

  private getMetrics(): void {
    this.isLoading = true;
    this._profilesServiceProxy.getTutorMetrics(this.appSession.userId)
      .pipe(takeUntil(this.destroyed$))
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(metric => this.profileMetric = metric);
  }
}
