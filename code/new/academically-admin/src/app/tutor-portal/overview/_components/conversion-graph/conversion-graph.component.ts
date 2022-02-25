import { Component, Injector, OnInit } from '@angular/core';
import { TutorPortalService } from '@app/videos/tutor-portal/_services/tutor-portal.service';
import { AppComponentBase } from '@shared/app-component-base';
import { VideoDto } from '@shared/service-proxies/service-proxies';
import * as moment from 'moment';

@Component({
  selector: 'app-conversion-graph',
  templateUrl: './conversion-graph.component.html',
  styleUrls: ['./conversion-graph.component.less']
})
export class ConversionGraphComponent extends AppComponentBase implements OnInit {
  chartSettings: any = {};

  model = new VideoDto();
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

  private setChartSettings(): void {
    this.chartSettings = {
      type: 'doughnut',
      options: {
        plugins: {
          tooltip: {
            callbacks: {
              afterLabel: function () {
                return '%'
              }
            }
          }
        }
      },
      data: {
        labels: ['Plays', 'Visits'],
        datasets: [{
          data: [60, 40],
          backgroundColor: ['#2C7BE5', '#A6C5F7']
        }]
      }
    };
  }
}
