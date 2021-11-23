import { Component, Injector, ChangeDetectorRef } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { ActivatedRoute } from '@angular/router';
import { CourseDto, CoursesServiceProxy } from '@shared/service-proxies/service-proxies';
import { takeUntil, finalize } from 'rxjs/operators';
import * as moment from 'moment';

enum RangeType {
  Week,
  Month,
  Year,
}

enum DataType {
  Revenue,
  Students,
  Completed,
}

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.less'],
  animations: [appModuleAnimation()],
})
export class OverviewComponent extends AppComponentBase {
  id: string;
  model: CourseDto = new CourseDto();
  isLoading = false;
  chartSettings: any = {};
  chartDataset: any[] = [];
  currentRangeType = RangeType.Week;
  currentDataType = DataType.Revenue;
  currentYAxis = 'y';
  shouldShowLastYear = false;

  RangeType = RangeType;
  DataType = DataType;

  constructor(
    injector: Injector,
    private _route: ActivatedRoute,
    private _coursesService: CoursesServiceProxy,
    private _cd: ChangeDetectorRef,
  ) {
    super(injector);
    this.setChartSettings();
    this._route.parent.parent.parent.paramMap.subscribe(paramMap => {
      if (paramMap.has('course-id')) {
        this.id = paramMap.get('course-id');
        this.getCourse();
      }
    });
  }

  onRangeTypeChange(type: RangeType): void {
    this.currentRangeType = type;
    this.setChartSettings();
  }

  onDataTypeChange(): void {
    this.setChartSettings();
  }

  onShowLastYearChange(): void {
    this.setChartSettings();
  }

  private getCourse(): void {
    this.isLoading = true;
    this._coursesService.get(this.id)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(response => {
        this.model = response;
      });
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

    switch (this.currentDataType) {
      case DataType.Revenue:
        this.currentYAxis = 'yAxisMoney';
        break;
      default:
        this.currentYAxis = 'yAxisNumber';
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
          }, {
            id: 'yAxisNumber',
            type: 'linear',
            display: 'auto',
            ticks: {
              callback: function (e) {
                return e;
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
    if (this.shouldShowLastYear) {
      dataSet.push({
        label: currentYear + 1,
        yAxisID: this.currentYAxis,
        data: [0, 10, 5, 15, 10, 20, 15, 25, 20, 30, 10, 5, 15, 10, 20, 15, 25, 20, 30, 25, 0, 10, 5, 15, 10, 20, 15, 25, 20, 30, 25],
        borderColor: '#d2ddec',
      });
    }
    this.chartDataset = dataSet;
  }
}
