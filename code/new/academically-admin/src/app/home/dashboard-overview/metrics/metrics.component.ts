import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ProfileMetricDto, ProfilesServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-metrics',
  templateUrl: './metrics.component.html',
  styleUrls: ['./metrics.component.less']
})
export class MetricsComponent extends AppComponentBase implements OnInit {
  profileMetric: ProfileMetricDto = new ProfileMetricDto();
  isLoading = false;

  constructor(
    injector: Injector,
    private _profilesServiceProxy: ProfilesServiceProxy,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.getMetrics();
  }

  private getMetrics(): void {
    this.isLoading = true;
    this._profilesServiceProxy.getMetrics(this.appSession.userId)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isLoading = false;
        }),
      )
      .subscribe((profileMetric) => {
        this.profileMetric = profileMetric;
        this.isLoading = false;
      });
  }
}
