import { Component, Injector, OnInit } from '@angular/core';
import { TutorPortalService } from '@app/videos/tutor-portal/_services/tutor-portal.service';
import { AppComponentBase } from '@shared/app-component-base';
import { VideoDto } from '@shared/service-proxies/service-proxies';
import * as moment from 'moment';

enum RangeType {
  Week,
  Month,
  Year,
}

enum ChartType {
  All,
  Video,
  Upsell,
}

@Component({
  selector: 'app-revenue-graph',
  templateUrl: './revenue-graph.component.html',
  styleUrls: ['./revenue-graph.component.less']
})
export class RevenueGraphComponent extends AppComponentBase implements OnInit {
  chartSettings: any = {};
  chartDataset: any[] = [];

  model = new VideoDto();
  RangeType = RangeType;
  ChartType = ChartType;
  currentRangeType = RangeType.Week;
  currentChartType = ChartType.All;
  currentYAxis = 'yAxisMoney';

  constructor(
    injector: Injector,
    private _tutorPortalService: TutorPortalService,
  ) {
    super(injector);
    this.setChartSettings();
    this._tutorPortalService.video$.subscribe(response => {
      this.model = response;
    });
  }

  ngOnInit(): void {
  }

  onRangeTypeChange(type: RangeType): void {
    this.currentRangeType = type;
    this.setChartSettings();
  }

  onChartTypeChange(): void {
    this.setChartSettings();
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
              callback: function (e) {
                return '£' + e;
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
      labels.push(moment(monthStart).add(i, 'days').format('MMM D'));
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
    const currentYear = moment().get('year');
    const dataSet: any[] = [
      {
        label: currentYear,
        yAxisID: this.currentYAxis,
        data: [25, 20, 30, 22, 17, 10, 18, 26, 28, 26, 20, 32, 25, 20, 30, 22, 17, 10, 18, 26, 28, 26, 20, 32, 25, 20, 30, 22, 17, 10, 18],
      },
    ];
    this.chartDataset = dataSet;
  }
}
