import { Component, Injector, Input, OnInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { CoachingDto, CoachingDtoPagedResultDto, CoachingsServiceProxy, DateGrains } from '@shared/service-proxies/service-proxies';
import { finalize, takeUntil } from 'rxjs/operators';

import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
  selector: 'app-explore-coachings',
  templateUrl: './coaching.component.html',
  styleUrls: ['./coaching.component.less'],
  animations: [appModuleAnimation()],
})
export class ExploreCoachingComponent extends AppComponentBase implements OnInit {

  @Input() isGroupByTopics = false;

  topicGroups: { [key: string]: CoachingDtoPagedResultDto  } = { 'Topic': { items: Array(3).fill([]).map(() => this.generateRandomCoaching()) as CoachingDto[], totalCount: 3 } as CoachingDtoPagedResultDto };

  featured: CoachingDto[] = Array(5).fill([]).map(() => this.generateRandomCoaching()) as CoachingDto[];
  latest: CoachingDtoPagedResultDto;
  latestStartDate: moment.Moment;
  lastMonth: CoachingDtoPagedResultDto;
  popular: CoachingDtoPagedResultDto;

  isLoading = true;
  isPopularLoading = true;
  data: { [key: string]: CoachingDto[] };

  showLastestShowMore: boolean = true;
  showLastMonthShowMoreButton: boolean = true;
  showPopularShowMoreButton: boolean = true;
  itemsPerGroup = 6;
  popularItems = 3;

  selectedTopics: string[] = [];

  latestMaxItems: number = 0;
  lastMonthMaxItems: number = 0;
  popularMaxItems: number = 0;

  get topics(): string[] { return this.topicGroups ? Object.keys(this.topicGroups) : null; }
  get filteredTopics(): string[] { return this.topics.filter(t => this.selectedTopics.includes(t)); }

  constructor(
    injector: Injector,
    private _coachingsService: CoachingsServiceProxy
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
    this._coachingsService.getByTopic(this.appSession.userId, topic, currentCount, this.itemsPerGroup)
    .pipe(takeUntil(this.destroyed$))
    .pipe(finalize(() => this.isLoading = false))
    .subscribe(coachings => {
      if (topic) {
        this.topicGroups[topic]?.items?.push(...coachings[topic]?.items)
      } else {
        this.topicGroups = coachings;
      }
    });
  }

  private loadGroupedByDates(currentCount: number, start?: moment.Moment, moving?: moment.Moment, end?: moment.Moment): void {
    this.isLoading = true;
    this._coachingsService.getByDates(this.appSession.userId, start, moving, end, DateGrains.Aged30, currentCount, this.itemsPerGroup)
      .pipe(takeUntil(this.destroyed$))
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(groupedCoachings => {
        Object.keys(groupedCoachings).forEach(range => {
          const [startDate] = range.split(' - ');

          if (moment().diff(moment(startDate), 'months')) {
            if (currentCount == 0) {
              this.latestStartDate = moment(startDate);
              this.lastMonth = groupedCoachings[range];
              this.setLastMonthShowMoreButtons(this.lastMonth?.items?.length);
            }
            else {
              this.lastMonth.items.push(...groupedCoachings[range].items);
              this.setLastMonthShowMoreButtons(this.lastMonth?.items?.length);
            }
          }
          else {
            this.latestStartDate = moment(startDate);
            if (currentCount == 0) {
              this.latest = groupedCoachings[range];
              this.setLatestShowMoreButtons(this.latest?.items?.length);

            } else {
              groupedCoachings[range].items.forEach(item => {
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
    this._coachingsService.getByPopularity(this.appSession.userId, currentCount, this.popularItems)
      .pipe(takeUntil(this.destroyed$))
      .pipe(finalize(() => this.isPopularLoading = false))
      .subscribe(groupedCourses => {
        if (groupedCourses) {
          Object.keys(groupedCourses).forEach(label => {
            const [startDate] = label.split(' - ');

            if (label == 'Popular') {
              if (currentCount == 0) {
                this.popular = groupedCourses[label];
                this.popularMaxItems = groupedCourses[label]?.totalCount;
                this.setPopularShowMoreButtons(this.popular?.items?.length);
              }
              else {
                this.popular.items.push(...groupedCourses[label].items);
                this.setPopularShowMoreButtons(this.popular?.items?.length);
              }
            }
          });
        } else {
          this.setPopularShowMoreButtons(this.popular?.items?.length);
        }
      });
  }

  handleFilterTopics(topics: string[]): void {
    this.selectedTopics = topics;
  }

  showTopicShowMoreButton(topic: string): boolean {
    if (this.topicGroups[topic]?.items?.length < this.topicGroups[topic]?.totalCount) {
      return true
    }
    return false;
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
}
