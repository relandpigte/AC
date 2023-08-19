import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ProfileMetricDto, ProfilesServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize, takeUntil } from '@node_modules/rxjs/operators';
import { ShimmerType } from '@shared/enums/shimmer/shimmer-type.enum';
import { DashboardPagesService } from '@shared/services/dashboard-pages.service';

@Component({
  selector: 'app-student-metrics',
  templateUrl: './student-metrics.component.html',
  styleUrls: ['./student-metrics.component.less']
})
export class StudentMetricsComponent extends AppComponentBase implements OnInit {
  profileMetric: ProfileMetricDto = new ProfileMetricDto();
  isLoading = false;

  shimmerType = ShimmerType;

  constructor(
    injector: Injector,
    private _dashboardPageService: DashboardPagesService,
    private _profilesServiceProxy: ProfilesServiceProxy,
  ) {
    super(injector);
  }

  get isLoading$() { return this._dashboardPageService.isLoading$; }

  ngOnInit(): void {
    this.getMetrics();
  }

  private getMetrics(): void {
    this.isLoading = true;
    this._profilesServiceProxy.getMetrics(this.appSession.userId)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => this.isLoading = false),
      )
      .subscribe((profileMetric) => {
        this.profileMetric = profileMetric;
      });
  }
}
