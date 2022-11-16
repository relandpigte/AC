import { Component, Injector, Input, OnInit } from '@angular/core';
import { ArticleService } from '@app/articles/_services/article.service';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { ArticleDto, ArticleDtoPagedResultDto, ArticlesServiceProxy, DateGrains } from '@shared/service-proxies/service-proxies';
import { finalize, takeUntil } from 'rxjs/operators';

import * as moment from 'moment';
import * as _ from 'lodash';
import { Router } from '@angular/router';

@Component({
  selector: 'app-explore-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.less'],
  animations: [appModuleAnimation()],
})
export class ExploreArticlesComponent extends AppComponentBase implements OnInit {

  @Input() isGroupByTopics = false;

  topicGroups: { [key: string]: ArticleDtoPagedResultDto  } = { 'Topic': { items: Array(3).fill([]).map(() => this.generateRandomArticle()) as ArticleDto[], totalCount: 3 } as ArticleDtoPagedResultDto };

  latest: ArticleDtoPagedResultDto;
  latestStartDate: moment.Moment;
  lastMonth: ArticleDtoPagedResultDto;
  popular: ArticleDtoPagedResultDto;
  featured: ArticleDto[] = Array(5).fill([]).map(() => this.generateRandomArticle()) as ArticleDto[];

  isLoading = true;
  isPopularLoading = true;

  showLastestShowMore: boolean = true;
  showLastMonthShowMoreButton: boolean = true;
  showPopularShowMoreButton: boolean = true;
  itemsPerGroup = 6;
  popularItems = 2;

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
    private _articleService: ArticlesServiceProxy
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

  setTopicShowMoreButtons(items: number): void {
    if (items == this.popularItems) {
      this.showPopularShowMoreButton = true;
    } else {
      this.showPopularShowMoreButton = false;
    }
  }

  private loadGroupedByTopics(currentCount: number, topic?: string): void {
    this._articleService.getByTopic(this.appSession.userId, topic, currentCount, this.itemsPerGroup)
    .pipe(takeUntil(this.destroyed$))
    .pipe(finalize(() => this.isLoading = false))
    .subscribe(articles => {
      if (topic) {
        this.topicGroups[topic]?.items?.push(...articles[topic].items)
      } else {
        this.topicGroups = articles;
      }
    });
  }

  private loadGroupedByDates(currentCount: number, start?: moment.Moment, moving?: moment.Moment, end?: moment.Moment): void {
    this.isLoading = true;
    this._articleService.getByDates(this.appSession.userId, start,moving, end, DateGrains.Monthly, currentCount, this.itemsPerGroup)
      .pipe(takeUntil(this.destroyed$))
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(groupedArticles => {
        Object.keys(groupedArticles).forEach(range => {
          const [startDate] = range.split(' - ');
          console.log('GroupedVideos ----> ', groupedArticles[range]);
          if (moment().diff(moment(startDate), 'months')) {
            if (currentCount == 0) {
              this.latestStartDate = moment(startDate);
              this.lastMonth = groupedArticles[range];
              this.lastMonthMaxItems = groupedArticles[range].totalCount;
              this.setLastMonthShowMoreButtons(this.lastMonth?.items?.length);
            }
            else {
              this.lastMonth.items.push(...groupedArticles[range].items);
              this.setLastMonthShowMoreButtons(this.lastMonth?.items?.length);
            }
          }
          else {
            this.latestStartDate = moment(startDate);
            if (currentCount == 0) {
              this.latest = groupedArticles[range];
              this.latestMaxItems = groupedArticles[range].totalCount;
              this.setLatestShowMoreButtons(this.latest?.items?.length);

            } else {
              groupedArticles[range].items.forEach(item => {
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
    this._articleService.getByPopularity(this.appSession.userId, currentCount, this.popularItems)
      .pipe(takeUntil(this.destroyed$))
      .pipe(finalize(() => this.isPopularLoading = false))
      .subscribe(groupedArticles => {
        if (groupedArticles) {
          Object.keys(groupedArticles).forEach(label => {
            const [startDate] = label.split(' - ');
            console.log('Popular Videos ----> ', groupedArticles[label]);
            if (label == 'Popular') {
              if (currentCount == 0) {
                this.popular = groupedArticles[label];
                this.popularMaxItems = groupedArticles[label]?.totalCount;
                this.setPopularShowMoreButtons(this.popular?.items?.length);
              }
              else {
                this.popular.items.push(...groupedArticles[label].items);
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

  handleFilterTopics(topics: string[]): void {
    this.selectedTopics = topics;
  }

  showTopicShowMoreButton(topic: string): boolean {
    if (this.topicGroups[topic]?.items?.length < this.topicGroups[topic]?.totalCount) {
      return true
    }
    return false;
  }

  handleServiceCardClick(article: ArticleDto): void {
    this._router.navigate(['/app/articles/student-portal', article.id]);
  }

}
