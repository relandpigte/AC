import { Component, Injector, Input, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { finalize, takeUntil } from 'rxjs/operators';

import { ShimmerType } from '@shared/enums/shimmer/shimmer-type.enum';
import { DashboardPagesService } from '@shared/services/dashboard-pages.service';
import { ProfilesServiceProxy, ServiceMetricsDto, ServicesServiceProxy, ServicesType, TutorProfileMetricDto } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-service-metrics',
  templateUrl: './service-metrics.component.html',
  styleUrls: ['./service-metrics.component.less']
})
export class ServiceMetricsComponent extends AppComponentBase implements OnInit {
  @Input() serviceType: ServicesType;

  serviceMetrics: ServiceMetricsDto;
  isLoading = false;
  shimmerType = ShimmerType;

  constructor(
    injector: Injector,
    private _dashboardPageService: DashboardPagesService,
    private _servicesService: ServicesServiceProxy
  ) {
    super(injector);
  }

  get isLoading$() { return this._dashboardPageService.isLoading$; }
  get serviceRevenue(): string { return this.serviceMetrics?.revenue?.toLocaleString(); }
  get serviceSales(): string { return this.serviceMetrics?.sales?.toLocaleString(); }
  get serviceCreated(): number { return this.serviceMetrics?.created; }
  get serviceReviews(): number { return this.serviceMetrics?.overallReview; }
  get serviceTypeName(): string { return this.serviceType ? ServicesType[this.serviceType] : null; }

  ngOnInit(): void {
    this.getServiceMetrics();
  }

  private getServiceMetrics(): void {
    this.isLoading = true;
    this._servicesService.getServiceMetrics(this.currentUserId, this.serviceType)
      .pipe(takeUntil(this.destroyed$))
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(metric => this.serviceMetrics = metric);
  }
}
