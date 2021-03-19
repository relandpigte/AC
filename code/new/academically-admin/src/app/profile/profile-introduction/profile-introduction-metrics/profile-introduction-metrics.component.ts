import { Component, OnInit } from '@angular/core';
import { ProfileMetricDto, ProfilesServiceProxy } from '@shared/service-proxies/service-proxies';
import { ProfileService } from '@shared/services/profile.service';

@Component({
  selector: 'app-profile-introduction-metrics',
  templateUrl: './profile-introduction-metrics.component.html',
  styleUrls: ['./profile-introduction-metrics.component.less']
})
export class ProfileIntroductionMetricsComponent implements OnInit {
  profileMetric: ProfileMetricDto = new ProfileMetricDto();
  isLoading = false;

  constructor(
    profileService: ProfileService,
    private _profilesServiceProxy: ProfilesServiceProxy,
  ) {
    profileService.$user.subscribe(user => {
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
