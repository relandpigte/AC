import { Component, Injector, OnInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { DateGrains, VideoDto, VideoDtoPagedResultDto, VideosServiceProxy } from '@shared/service-proxies/service-proxies';
import * as _ from 'lodash';
import * as moment from 'moment';
import { finalize, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-explore-tutorials',
  templateUrl: './tutorials.component.html',
  styleUrls: ['./tutorials.component.less'],
  animations: [appModuleAnimation()],
})
export class ExploreTutorialsComponent extends AppComponentBase implements OnInit {

  latest: VideoDtoPagedResultDto;
  lastMonth: VideoDtoPagedResultDto;
  featured: VideoDto[] = Array(5).fill([]).map(() => this.generateRandomTutorial()) as VideoDto[];

  isLoading = true;
  data: { [key: string]: VideoDto[] };

  constructor(
    injector: Injector,
    private _videoService: VideosServiceProxy
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.loadData(0);
    setTimeout(() => this.isLoading = false, 5000);
  }

  private loadData(currentCount: number, start?: moment.Moment, moving?: moment.Moment, end?: moment.Moment): void {
    this.isLoading = true;
    this._videoService.getByDates(this.appSession.userId, start,moving, end, DateGrains.Monthly, currentCount, 6)
      .pipe(takeUntil(this.destroyed$))
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(groupedVideos => {
        Object.keys(groupedVideos).forEach(range => {
          const [startDate] = range.split(' - ');
          if (moment().diff(moment(startDate), 'months'))
            this.lastMonth = groupedVideos[range]; // _.concat(this.lastMonth, groupedVideos[range]);
          else
            this.latest = groupedVideos[range]; // _.concat(this.latest, groupedVideos[range]);

        });
      });
  }

  onShowMoreLatestButtonClick(): void {
    console.log('LATEST SHOW MORE CLICKED')
  }

  onShowMoreLastMonthButtonClick(): void {
    console.log('LAST MONTH SHOW MORE CLICKED')
  }

  private generateData(count?: number, type?: number): any[] {
    let data = Array(count).fill([]).map(() => {
      const dataType = this.randomNonZero(6);
      switch(type ?? dataType) {
        case 1: return this.generateRandomEvent();
        case 2: return this.generateRandomArticle();
        case 3: return this.generateRandomCoaching();
        case 4: return this.generateRandomCourse();
        case 5: return this.generateRandomWorkshop();
        case 6: return this.generateRandomTutorial();
      }
    });
    return data;
  }
}
