import { Component, OnInit } from '@angular/core';
import { ProfileService } from '@app/profile/_services/profile.service';
import { ProfileMetricDto, ProfilesServiceProxy } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-metrics',
  templateUrl: './metrics.component.html',
  styleUrls: ['./metrics.component.less']
})
export class MetricsComponent implements OnInit {
  profileMetric: ProfileMetricDto = new ProfileMetricDto();
  isLoading = false;

  constructor(
    profileService: ProfileService,
    private _profilesServiceProxy: ProfilesServiceProxy,
  ) {
    profileService.user$.subscribe(user => {
      this.getMetrics(user.id);
    });
  }

  ngOnInit(): void {
  }

  private getMetrics(id: number): void {
    this.isLoading = true;
    this._profilesServiceProxy.getMetrics(id)
      .subscribe(profileMetric => {
        this.profileMetric = profileMetric;
        this.isLoading = false;
      });
  }
}
