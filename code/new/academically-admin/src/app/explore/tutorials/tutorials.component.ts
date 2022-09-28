import { Component, Injector, OnInit, TrackByFunction } from '@angular/core';
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
  latestStartDate: moment.Moment;
  lastMonth: VideoDtoPagedResultDto;
  popular: VideoDtoPagedResultDto;
  featured: VideoDto[] = Array(5).fill([]).map(() => this.generateRandomTutorial()) as VideoDto[];


  isLoading = true;
  isPopularLoading = true;
  data: { [key: string]: VideoDto[] };

  showLastestShowMore: boolean = true;
  showLastMonthShowMoreButton: boolean = true;
  showPopularShowMoreButton: boolean = true;
  itemsPerGroup = 6;
  popularItems = 3;

  constructor(
    injector: Injector,
    private _videoService: VideosServiceProxy,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.loadData(0);
    this.loadPopular(0);
    setTimeout(() => this.isLoading = false, 5000);

  }

  setLatestShowMoreButtons(items: number): void {
    if (items == this.itemsPerGroup) {
      this.showLastestShowMore = true;
    } else {
      this.showLastestShowMore = false;
    }
  }

  setLastMonthShowMoreButtons(items: number): void {
    if (items == this.itemsPerGroup) {
      this.showLastMonthShowMoreButton = true;
    } else {
      this.showLastMonthShowMoreButton = false;
    }
  }

  setPopularShowMoreButtons(items: number): void {
    if (items == this.popularItems) {
      this.showPopularShowMoreButton = true;
    } else {
      this.showPopularShowMoreButton = false;
    }
  }

  private loadData(currentCount: number, start?: moment.Moment, moving?: moment.Moment, end?: moment.Moment): void {
    this.isLoading = true;
    this._videoService.getByDates(this.appSession.userId, start,moving, end, DateGrains.Monthly, currentCount, this.itemsPerGroup)
      .pipe(takeUntil(this.destroyed$))
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(groupedVideos => {
        Object.keys(groupedVideos).forEach(range => {
          const [startDate] = range.split(' - ');
          console.log('GroupedVideos ----> ', groupedVideos[range]);
          if (moment().diff(moment(startDate), 'months')) {
            if (currentCount == 0) {
              this.latestStartDate = moment(startDate);
              this.lastMonth = groupedVideos[range];
              this.setLastMonthShowMoreButtons(this.lastMonth?.items?.length);
            }
            else {
              this.lastMonth.items.push(...groupedVideos[range].items);
              this.setLastMonthShowMoreButtons(groupedVideos[range]?.items?.length);
            }
          }
          else {
            this.latestStartDate = moment(startDate);
            if (currentCount == 0) {
              this.latest = groupedVideos[range];
              this.setLatestShowMoreButtons(this.latest?.items?.length);

            } else {
              this.setLatestShowMoreButtons(groupedVideos[range]?.items?.length);
              groupedVideos[range].items.forEach(item => {
                this.latest.items.push(item);
              });
            }
          }
        });
      });
  }

  private loadPopular(currentCount: number): void {
    this.isPopularLoading = true;
    this._videoService.getByPopularity(this.appSession.userId, currentCount, this.popularItems)
      .pipe(takeUntil(this.destroyed$))
      .pipe(finalize(() => this.isPopularLoading = false))
      .subscribe(groupedVideos => {
        if (groupedVideos) {
          Object.keys(groupedVideos).forEach(label => {
            const [startDate] = label.split(' - ');
            console.log('Popular Videos ----> ', groupedVideos[label]);
            if (label == 'Popular') {
              if (currentCount == 0) {
                this.popular = groupedVideos[label];
                this.setPopularShowMoreButtons(this.popular?.items?.length);
              }
              else {
                this.popular.items.push(...groupedVideos[label].items);
                this.setPopularShowMoreButtons(groupedVideos[label]?.items?.length);
              }
            }
          });
        } else {
          console.log('NO RESULT');
          this.setPopularShowMoreButtons(1);
        }
      });
  }

  onShowMorePopularButtonClick(): void {
    console.log('Show  more popular clicked -->', this.popular?.items?.length)
    this.loadPopular(this.popular?.items?.length);
  }

  onShowMoreLatestButtonClick(): void {
    const lastItem = this.latest.items.slice(-1)[0];
    console.log('LAST ITEM --->', lastItem)
    this.loadData(this.latest.items.length, this.latestStartDate, lastItem.creationTime);
  }

  onShowMoreLastMonthButtonClick(): void {
    const lastItem = this.lastMonth.items.slice(-1)[0];
    console.log('POPULAR BUTTON CLICKED');
    this.loadData(this.lastMonth.items.length, null, lastItem.creationTime);
  }

}
