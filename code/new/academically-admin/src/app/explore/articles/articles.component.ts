import { Component, Injector, OnInit } from '@angular/core';
import { ArticleService } from '@app/articles/_services/article.service';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { ArticleDto, ArticleDtoPagedResultDto, ArticlesServiceProxy, DateGrains } from '@shared/service-proxies/service-proxies';
import { finalize, takeUntil } from 'rxjs/operators';

import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
  selector: 'app-explore-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.less'],
  animations: [appModuleAnimation()],
})
export class ExploreArticlesComponent extends AppComponentBase implements OnInit {

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
  popularItems = 3;

  constructor(
    injector: Injector,
    private _articleService: ArticlesServiceProxy
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
              this.setLastMonthShowMoreButtons(this.lastMonth?.items?.length);
            }
            else {
              this.lastMonth.items.push(...groupedArticles[range].items);
              this.setLastMonthShowMoreButtons(groupedArticles[range]?.items?.length);
            }
          }
          else {
            this.latestStartDate = moment(startDate);
            if (currentCount == 0) {
              this.latest = groupedArticles[range];
              this.setLatestShowMoreButtons(this.latest?.items?.length);

            } else {
              this.setLatestShowMoreButtons(groupedArticles[range]?.items?.length);
              groupedArticles[range].items.forEach(item => {
                this.latest.items.push(item);
              });
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
                this.setPopularShowMoreButtons(this.popular?.items?.length);
              }
              else {
                this.popular.items.push(...groupedArticles[label].items);
                this.setPopularShowMoreButtons(groupedArticles[label]?.items?.length);
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
