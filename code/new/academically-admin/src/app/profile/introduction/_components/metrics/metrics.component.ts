import { Component, OnInit, Injector } from "@angular/core";
import { AppComponentBase } from "@shared/app-component-base";
import { ProfileService } from "@app/profile/_services/profile.service";
import {
  ProfileMetricDto,
  UserDto,
  TutorRatingSummaryDto,
  ProfilesServiceProxy,
  RatingsServiceProxy,
} from "@shared/service-proxies/service-proxies";
import { finalize } from 'rxjs/operators';

@Component({
  selector: "app-metrics",
  templateUrl: "./metrics.component.html",
  styleUrls: ["./metrics.component.less"],
})
export class MetricsComponent extends AppComponentBase implements OnInit {
  profileMetric: ProfileMetricDto = new ProfileMetricDto();
  isLoading = false;
  isAveRatingLoading = false;
  user: UserDto;
  tutorRatingSummary: TutorRatingSummaryDto = new TutorRatingSummaryDto();

  constructor(
    injector: Injector,
    profileService: ProfileService,
    private _profilesServiceProxy: ProfilesServiceProxy,
    private _ratingsService: RatingsServiceProxy
  ) {
    super(injector);
    profileService.user$.subscribe((user) => {
      this.user = user;
      this.isTutor = user.roleNames.findIndex(e => e.toLowerCase() === 'tutor') >= 0;
      this.getMetrics(user.id);
      this.getRatingSummary();
    });
  }

  ngOnInit(): void {}

  private getMetrics(id: number): void {
    this.isLoading = true;
    this._profilesServiceProxy.getMetrics(id).subscribe((profileMetric) => {
      this.profileMetric = profileMetric;
      this.isLoading = false;
    });
  }

  private getRatingSummary(): void {
    this.isAveRatingLoading = true;
    this._ratingsService
      .getTutorRatingSummary(this.user.id)
      .pipe(
        finalize(() => {
          this.isAveRatingLoading = false;
        })
      )
      .subscribe((tutorRatingSummary) => {
        this.tutorRatingSummary = tutorRatingSummary;
      });
  }
}
