import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { GetProfileDetailDto, UserProfilesServiceProxy } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'financial-dashboard',
  templateUrl: './financial-dashboard.component.html',
  styleUrls: ['./financial-dashboard.component.less']
})
export class FinancialDashboardComponent extends AppComponentBase implements OnInit {
  userId: number;
  profile: GetProfileDetailDto = new GetProfileDetailDto();
  varkStyleChartSettings = {
    type: 'line',
    options: {
      scales: { yAxes: [{ display: !1 }], xAxes: [{ display: !1 }] },
      elements: { line: { borderWidth: 2 }, point: { hoverRadius: 0 } },
      tooltips: {
        custom: function() {
          return !1;
        }
      }
    },
    data: { labels: new Array(12), datasets: [{ data: [0, 15, 10, 25, 30, 15, 40, 50, 80, 60, 55, 65] }] }
  };
  barChart = {
    type: 'bar',
    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              callback: function(value) {
                return '$' + value + 'k';
              }
            }
          }
        ]
      }
    },
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          label: 'Income',
          data: [25, 20, 30, 22, 17, 10, 18, 26, 28, 26, 20, 32]
        },
        {
          label: 'Expenditure',
          data: [35, 12, 15, 40, 20, 5, 10, 20, 23, 24, 25, 10],
          backgroundColor: [
            '#A6C5F7',
            '#A6C5F7',
            '#A6C5F7',
            '#A6C5F7',
            '#A6C5F7',
            '#A6C5F7',
            '#A6C5F7',
            '#A6C5F7',
            '#A6C5F7',
            '#A6C5F7',
            '#A6C5F7',
            '#A6C5F7'
          ]
        },
        {
          label: 'Net Profit',
          data: [3, 15, 10, 25, 30, 5, 20, 10, 5, 15, 20, 35],
          backgroundColor: ['green', 'green', 'green', 'green', 'green', 'green', 'green', 'green', 'green', 'green', 'green', 'green']
        }
      ]
    }
  };
  lineChart = {
    type: 'line',
    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              callback: function(value) {
                return '$' + value + 'k';
              }
            }
          }
        ]
      }
    },
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          label: 'Earned',
          data: [0, 10, 5, 15, 10, 20, 15, 25, 20, 30, 25, 40]
        }
      ]
    }
  };
  doughnutChart = {
    type: 'doughnut',
    options: {
      tooltips: {
        callbacks: {
          afterLabel: function() {
            return '%';
          }
        }
      }
    },
    data: {
      labels: ['Direct', 'Organic', 'Referral'],
      datasets: [
        {
          data: [60, 25, 15],
          backgroundColor: ['#2C7BE5', '#A6C5F7', '#D2DDEC']
        }
      ]
    }
  };
  constructor(private injector: Injector, private _userProfileService: UserProfilesServiceProxy) {
    super(injector);
    this.userId = this.appSession.userId;
  }

  ngOnInit(): void {
    this.getUserDetail();
  }

  private getUserDetail(): void {
    this._userProfileService.getDetail(this.userId).subscribe(profile => {
      this.profile = profile;
      console.log(this.profile);
    });
  }
}
