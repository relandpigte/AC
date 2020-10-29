import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { GetProfileDetailDto, UserProfilesServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/session/app-session.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.less'],
})
export class ProfileComponent extends AppComponentBase implements OnInit {
  userId: number;
  profileDetail: GetProfileDetailDto = new GetProfileDetailDto();
  availabilityChartSettings = {
    type: 'bar',
    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              callback: function (d) {
                return d + 'hrs';
              },
            },
          },
        ],
      },
    },
    data: { labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], datasets: [{ data: [21, 12, 28, 15, 5, 12, 17, 2] }] },
  };
  varkStyleChartSettings = {
    type: 'line',
    options: {
      scales: { yAxes: [{ display: !1 }], xAxes: [{ display: !1 }] },
      elements: { line: { borderWidth: 2 }, point: { hoverRadius: 0 } },
      tooltips: {
        custom: function () {
          return !1;
        },
      },
    },
    data: { labels: new Array(12), datasets: [{ data: [0, 15, 10, 25, 30, 15, 40, 50, 80, 60, 55, 65] }] },
  };
  isLoading = false;
  isViewOnly = false;

  constructor(
    injector: Injector,
    private _sessionService: AppSessionService,
    private _userProfilesService: UserProfilesServiceProxy,
    private _route: ActivatedRoute,
    private _router: Router
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this._route.paramMap.subscribe((paramMap) => {
      const userId = +paramMap.get('userId');
      if (userId) {
        if (userId !== this._sessionService.userId) {
          this.isViewOnly = true;
        }
        this.userId = userId;
      } else {
        this.userId = this._sessionService.userId;
      }
      this.getUserProfile();
    });
  }

  onScrollClick(e: any, el: HTMLElement): void {
    e.preventDefault();
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  private getUserProfile(): void {
    this.isLoading = true;
    this._userProfilesService.getDetail(this.userId).subscribe((profileDetail) => {
      if (this.isViewOnly && profileDetail.role.toLowerCase() !== 'tutor') {
        this._router.navigate(['/account/404']);
      }
      this.profileDetail = profileDetail;
      this.isLoading = false;
    });
  }
}
