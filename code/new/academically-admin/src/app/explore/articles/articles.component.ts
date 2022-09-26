import { Component, Injector, OnInit } from '@angular/core';
import { ArticleService } from '@app/articles/_services/article.service';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { ArticleDto, ArticlesServiceProxy, DateGrains } from '@shared/service-proxies/service-proxies';
import * as moment from 'moment';
import { finalize, takeUntil } from 'rxjs/operators';
import * as _ from 'lodash';

@Component({
  selector: 'app-explore-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.less'],
  animations: [appModuleAnimation()],
})
export class ExploreArticlesComponent extends AppComponentBase implements OnInit {

  featured: ArticleDto[] = Array(5).fill([]).map(() => this.generateRandomArticle()) as ArticleDto[];
  latest: ArticleDto[] = Array(3).fill([]).map(() => this.generateRandomArticle()) as ArticleDto[];
  lastMonth: ArticleDto[] = Array(3).fill([]).map(() => this.generateRandomArticle()) as ArticleDto[];

  isLoading = true;

  constructor(
    injector: Injector,
    private _articleService: ArticlesServiceProxy
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.loadData();
    setTimeout(() => this.isLoading = false, 5000);
  }

  private loadData(): void {
    this.isLoading = true;
    this._articleService.getByDates(DateGrains.Monthly, 6)
      .pipe(takeUntil(this.destroyed$))
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(events => {
        this.latest = [];
        this.lastMonth = [];
        Object.keys(events).forEach(range => {
          const [startDate] = range.split(' - ');
          if (moment().diff(moment(startDate), 'months'))
            this.lastMonth = _.concat(this.lastMonth, events[range]);
          else
            this.latest = _.concat(this.latest, events[range]);
        });
      });

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
