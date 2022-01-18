import { Component, OnInit, Injector } from '@angular/core';
import { ArticleDto, ArticleStatus, ArticleType, ArticlesServiceProxy, ArticleDtoPagedResultDto } from '@shared/service-proxies/service-proxies';
import { PagedAndSortedRequestDto, PagedListingComponentBase } from '@shared/paged-listing-component-base';
import { ArticleService } from '@app/articles/_services/article.service';
import { finalize } from 'rxjs/operators';

class PagedArticleRequestDto extends PagedAndSortedRequestDto {
  userIdFilter: number;
  searchFilter?: string;
  statusFilter?: ArticleStatus;
}

@Component({
  selector: 'app-teaching',
  templateUrl: './teaching.component.html',
  styleUrls: ['./teaching.component.less']
})
export class TeachingComponent extends PagedListingComponentBase<ArticleDto> implements OnInit {
  articles: ArticleDto[] = [];
  searchFilter?: string;
  statusFilter?: number;

  ArticleStatus = ArticleStatus;
  ArticleType = ArticleType;

  constructor(
    injector: Injector,
    private _articlesService: ArticlesServiceProxy,
    private _articleService: ArticleService,
  ) {
    super(injector);
    this._articleService.articleCreated$.subscribe(article => {
      if (article) {
        this.refresh();
      }
    });
  }

  onClearFiltersClick(): void {
    this.searchFilter = undefined;
    this.statusFilter = undefined;
  }

  protected list(
    request: PagedArticleRequestDto,
    pageNumber: number,
    finishedCallback: Function,
  ): void {
    request.userIdFilter = this.appSession.userId;
    request.searchFilter = this.searchFilter;
    request.statusFilter = this.statusFilter;

    this._articlesService
      .getAll(
        request.userIdFilter,
        request.searchFilter,
        request.statusFilter,
        request.skipCount,
        request.maxResultCount
      )
      .pipe(
        finalize(() => {
          finishedCallback();
        })
      )
      .subscribe((result: ArticleDtoPagedResultDto) => {
        this.articles = result.items;
        this.showPaging(result, pageNumber);
      });
  }
}
