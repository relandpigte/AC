import { Component, Injector, OnInit } from '@angular/core';
import { TutorPortalService } from '@app/videos/tutor-portal/_services/tutor-portal.service';
import { AppComponentBase } from '@shared/app-component-base';
import { VideoDto } from '@shared/service-proxies/service-proxies';
import * as moment from 'moment';

enum ChartType {
  Attention,
  Questions,
}

@Component({
  selector: 'app-engagement-graph',
  templateUrl: './engagement-graph.component.html',
  styleUrls: ['./engagement-graph.component.less']
})
export class EngagementGraphComponent extends AppComponentBase implements OnInit {
  chartSettings: any = {};
  chartDataset: any[] = [];

  model = new VideoDto();
  ChartType = ChartType;
  currentChartType = ChartType.Attention;
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

  onChartTypeChange(): void {
    this.setChartSettings();
  }

  private setChartSettings(): void {
    let labels = this.getCurrentMonthDays();

    this.chartSettings = {
      type: 'line',
      data: {
        labels: labels,
      }
    };
    this.setDataset();
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
