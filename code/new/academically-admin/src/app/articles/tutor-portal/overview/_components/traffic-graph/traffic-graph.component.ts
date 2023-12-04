import { Component, Injector, OnInit } from '@angular/core';
import { TutorPortalService } from '@app/articles/tutor-portal/_services/tutor-portal.service';
import { AppComponentBase } from '@shared/app-component-base';
import { ArticleDto } from '@shared/service-proxies/service-proxies';
import * as moment from 'moment';

enum RangeType {
  Week,
  Month,
  Year,
}

enum ChartType {
  Visits,
  Likes,
  Saves,
  Shares,
  Purchases,
  Plays,
}

@Component({
  selector: 'app-traffic-graph',
  templateUrl: './traffic-graph.component.html',
  styleUrls: ['./traffic-graph.component.less']
})
export class TrafficGraphComponent extends AppComponentBase implements OnInit {
  chartSettings: any = {};
  chartDataset: any[] = [];

  model = new ArticleDto();
  RangeType = RangeType;
  ChartType = ChartType;
  currentRangeType = RangeType.Week;
  currentChartType = ChartType.Visits;

  constructor(
    injector: Injector,
    private _tutorPortalService: TutorPortalService,
  ) {
    super(injector);
    this.setChartSettings();
    this._tutorPortalService.article$.subscribe(response => {
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
      type: 'bar',
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
        data: [25, 20, 30, 22, 17, 10, 18, 26, 28, 26, 20, 32, 25, 20, 30, 22, 17, 10, 18, 26, 28, 26, 20, 32, 25, 20, 30, 22, 17, 10, 18],
      },
    ];
    this.chartDataset = dataSet;
  }
}
