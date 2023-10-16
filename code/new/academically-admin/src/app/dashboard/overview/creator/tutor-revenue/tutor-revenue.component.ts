import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ProfilesServiceProxy, VideoDto } from '@shared/service-proxies/service-proxies';
import * as moment from '@node_modules/moment';
import { TutorPortalService } from '@app/videos/tutor-portal/_services/tutor-portal.service';

enum RangeType {
  Week,
  Month,
  Year,
}

@Component({
  selector: 'app-tutor-revenue',
  templateUrl: './tutor-revenue.component.html',
  styleUrls: ['./tutor-revenue.component.less']
})
export class TutorRevenueComponent extends AppComponentBase implements OnInit {
  chartSettings: any = {};
  chartDataset: any[] = [];
  model = new VideoDto();
  RangeType = RangeType;
  currentRangeType = RangeType.Week;
  currentYAxis = 'yAxisMoney';
  data: number[] = [];

  constructor(
    injector: Injector,
    private _tutorPortalService: TutorPortalService,
    private _profilesService: ProfilesServiceProxy
  ) {
    super(injector);
  }

  async ngOnInit(): Promise<void> {
    await this.initData();
    this.setChartSettings();
    this._tutorPortalService.video$.subscribe(response => {
      this.model = response;
    });
  }

  async onRangeTypeChange(type: RangeType): Promise<void> {
    this.currentRangeType = type;
    switch (type) {
      case RangeType.Year:
        this.data = await this._profilesService.getAnnualRevenue().toPromise();
        break;
      case RangeType.Month:
        this.data = await this._profilesService.getMonthlyRevenue().toPromise();
        break;
      default:
        this.data = await this._profilesService.getWeeklyRevenue().toPromise();
        break;
    }

    setTimeout(() => this.setChartSettings());
  }

  private setChartSettings(): void {
    let labels: string[];
    switch (this.currentRangeType) {
      case RangeType.Month:
        labels = this.getCurrentMonthDays();
        break;
      case RangeType.Year:
        labels = this.getCurrentYearMonths();
        break;
      default:
        labels = this.getCurrentWeekDays();
        break;
    }

    this.chartSettings = {
      type: 'line',
      options: {
        scales: {
          yAxes: [{
            id: 'yAxisMoney',
            type: 'linear',
            display: 'auto',
            ticks: {
              min: 0,
              max: 1000,
              stepSize: 200,
              callback: (num: number): string => {
                return `£${Math.abs(num) > 999 ?
                  Math.sign(num) * ((Math.abs(num) / 1000)) + 'k' :
                  Math.sign(num) * Math.abs(num)}`;
              }
            }
          }]
        }
      },
      data: {
        labels: labels,
      }
    };
    this.setDataset();
  }

  private getCurrentWeekDays(): string[] {
    const currentDay = moment();
    const labels: string[] = [];
    const weekStart = currentDay.clone().startOf('week');
    for (let i = 0; i < 7; i++) {
      labels.push(moment(weekStart).add(i, 'days').format('MMM D'));
    }
    return labels;
  }

  private getCurrentMonthDays(): string[] {
    const currentDay = moment();
    const labels: string[] = [];
    const monthStart = currentDay.clone().startOf('month');
    const daysInMonth = currentDay.clone().daysInMonth();
    for (let i = 0; i < daysInMonth; i++) {
      if (i % 3 === 0) {
        labels.push(moment(monthStart).add(i > 1 ? i - 1 : i, 'days').format('MMM D'));
      }
    }
    return labels;
  }

  private getCurrentYearMonths(): string[] {
    const currentDay = moment();
    const labels: string[] = [];
    for (let i = 0; i < 12; i++) {
      labels.push(currentDay.month(i).format('MMM'));
    }
    return labels;
  }

  private setDataset(): void {
    this.chartDataset = [
      {
        label: moment().get('year'),
        yAxisID: this.currentYAxis,
        data: this.data,
      },
    ];
  }

  private async initData(): Promise<void> {
    this.data = await this._profilesService.getWeeklyRevenue().toPromise();
  }
}
