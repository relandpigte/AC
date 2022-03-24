import { Component, OnInit, Injector } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { TopicsServiceProxy, TopicUsageDto } from '@shared/service-proxies/service-proxies';
import { takeUntil } from 'rxjs/operators';
import * as moment from 'moment';

@Component({
  selector: 'app-usage',
  templateUrl: './usage.component.html',
  styleUrls: ['./usage.component.less'],
  animations: [appModuleAnimation()],
})
export class UsageComponent extends AppComponentBase implements OnInit {
  topics: TopicUsageDto[] = [];
  chartSettings: any = {
    type: 'horizontalBar',
    options: {
      tooltips: {
        callbacks: {
          label: function (tooltipItem, data) {
            const label = data.datasets[tooltipItem.datasetIndex].label || '';
            return `&nbsp;${label}: ${tooltipItem.value}`;
          }
        }
      }
    }
  };
  chartDataset: any[] = [];

  constructor(
    injector: Injector,
    private _topicsService: TopicsServiceProxy,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.getUsage();
  }

  private getUsage(): void {
    this._topicsService.getUsage()
      .pipe(takeUntil(this.destroyed$))
      .subscribe(responses => {
        this.topics = responses;
        this.chartSettings.data = {
          labels: this.topics.map(e => this.toTitleCase(e.name))
        };
        this.setDataset();
      });
  }

  private setDataset(): void {
    const currentYear = moment().get('year');
    const dataSet: any[] = [
      {
        label: 'Usage',
        data: this.topics.map(e => e.totalUsage),
      },
    ];
    this.chartDataset = dataSet;
  }

  private toTitleCase(str: string): string {
    return str.replace(
      /\w\S*/g,
      function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    );
  }
}
