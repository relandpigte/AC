import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ProfileMetricDto, ProfilesServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize, takeUntil } from '@node_modules/rxjs/operators';

@Component({
  selector: 'app-tutor-metrics',
  templateUrl: './tutor-metrics.component.html',
  styleUrls: ['./tutor-metrics.component.less']
})
export class TutorMetricsComponent extends AppComponentBase implements OnInit {
  profileMetric: ProfileMetricDto = new ProfileMetricDto();
  isLoading = false;

  constructor(
    injector: Injector,
    private _profilesServiceProxy: ProfilesServiceProxy
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
        finalize(() => this.isLoading = false),
      )
      .subscribe((profileMetric) => {
        this.profileMetric = profileMetric;
      });
  }
}
