import { Component, Injector, Input, OnInit, TrackByFunction } from '@angular/core';
import { Router } from '@angular/router';
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

  @Input() isGroupByTopics = false;

  topicGroups: { [key: string]: VideoDtoPagedResultDto } = { 'Topic': { items: Array(3).fill([]).map(() => this.generateRandomTutorial()) as VideoDto[], totalCount: 3 } as VideoDtoPagedResultDto };

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

  latestMaxItems: number = 0;
  lastMonthMaxItems: number = 0;
  popularMaxItems: number = 0;

  selectedTopics: string[] = [];

  get topics(): string[] { return this.topicGroups ? Object.keys(this.topicGroups) : null; }
  get validTopics(): string[] { return this.topics?.filter(x => x); }
  get filteredTopics(): string[] { return this.topics.filter(t => this.selectedTopics.includes(t)); }

  constructor(
    injector: Injector,
    private _router: Router,
    private _videoService: VideosServiceProxy,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.isLoading = true;
    if (this.isGroupByTopics) this.loadGroupedByTopics(0);
    else {
      this.loadGroupedByDates(0);
      this.loadPopular(0);
    }
  }

  setLatestShowMoreButtons(items: number): void {
    if (items < this.latestMaxItems) {
      this.showLastestShowMore = true;
    } else {
      this.showLastestShowMore = false;
    }
  }

  setLastMonthShowMoreButtons(items: number): void {
    console.log('setLastMonthShowMoreButtons() --->', items, this.lastMonthMaxItems)
    if (items < this.lastMonthMaxItems) {
      this.showLastMonthShowMoreButton = true;
    } else {
      this.showLastMonthShowMoreButton = false;
    }
  }

  setPopularShowMoreButtons(items: number): void {
    if (items < this.popularMaxItems) {
      this.showPopularShowMoreButton = true;
    } else {
      this.showPopularShowMoreButton = false;
    }
  }


  private loadGroupedByTopics(currentCount: number, topic?: string): void {
    this._videoService.getByTopic(this.appSession.userId, topic, currentCount, this.itemsPerGroup)
    .pipe(takeUntil(this.destroyed$))
    .pipe(finalize(() => this.isLoading = false))
    .subscribe(videos => {
      if (topic) {
        this.topicGroups[topic]?.items?.push(...videos[topic].items)
      } else {
        this.topicGroups = videos;
      }
    });
  }

  private loadGroupedByDates(currentCount: number, start?: moment.Moment, moving?: moment.Moment, end?: moment.Moment): void {
    this.isLoading = true;
    this._videoService.getByDates(this.appSession.userId, start,moving, end, DateGrains.Aged30, currentCount, this.itemsPerGroup)
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
              this.lastMonthMaxItems = groupedVideos[range].totalCount;
              this.setLastMonthShowMoreButtons(this.lastMonth?.items?.length);
            }
            else {
              this.lastMonth.items.push(...groupedVideos[range].items);
              this.setLastMonthShowMoreButtons(this.lastMonth?.items?.length);
            }
          }
          else {
            this.latestStartDate = moment(startDate);
            if (currentCount == 0) {
              this.latest = groupedVideos[range];
              this.latestMaxItems = groupedVideos[range].totalCount;
              this.setLatestShowMoreButtons(this.latest?.items?.length);

            } else {
              groupedVideos[range].items.forEach(item => {
                this.latest.items.push(item);
              });
              this.setLatestShowMoreButtons(this.latest?.items?.length);
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
                this.popularMaxItems = groupedVideos[label]?.totalCount;
                this.setPopularShowMoreButtons(this.popular?.items?.length);
              }
              else {
                this.popular.items.push(...groupedVideos[label].items);
                this.setPopularShowMoreButtons(this.popular?.items?.length);
              }
            }
          });
        } else {
          console.log('NO RESULT');
          this.setPopularShowMoreButtons(this.popular?.items?.length);
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
    this.loadGroupedByDates(this.latest.items.length, this.latestStartDate, lastItem.creationTime);
  }

  onShowMoreLastMonthButtonClick(): void {
    const lastItem = this.lastMonth.items.slice(-1)[0];
    console.log('POPULAR BUTTON CLICKED');
    this.loadGroupedByDates(this.lastMonth.items.length, undefined, lastItem.creationTime);
  }

  onShowMoreTopicButtonClick(topic: string): void {
    console.log('SHOW MORE TOPIC BUTTON CLICKED');
    this.loadGroupedByTopics(this.topicGroups[topic].items.length, topic);
  }

  showTopicShowMoreButton(topic: string): boolean {
    if (this.topicGroups[topic]?.items?.length < this.topicGroups[topic]?.totalCount) {
      return true
    }
    return false;
  }

  handleFilterTopics(topics: string[]): void {
    this.selectedTopics = topics;
  }

  handleServiceCardClick(tutorial: VideoDto): void {
    this._router.navigate(['app/videos/student-portal' , tutorial.id]);
  }
}
