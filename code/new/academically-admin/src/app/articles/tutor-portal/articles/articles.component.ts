import { Component, Injector, OnInit } from '@angular/core';
import { ArticleService } from '@app/articles/_services/article.service';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { PagedAndSortedRequestDto, PagedListingComponentBase } from '@shared/paged-listing-component-base';
import { ArticleDto, ArticleDtoPagedResultDto, ArticlesServiceProxy, ArticleStatus, ArticleType } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { TutorPortalService } from '../_services/tutor-portal.service';

class PagedArticleRequestDto extends PagedAndSortedRequestDto {
  parentIdFilter: string;
  searchFilter?: string;
  statusFilter?: ArticleStatus;
}

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.less'],
  animations: [appModuleAnimation()],
})
export class ArticlesComponent extends PagedListingComponentBase<ArticleDto> implements OnInit {
  articles: ArticleDto[] = [];
  searchFilter?: string;
  statusFilter?: number;

  model = new ArticleDto();
  ArticleStatus = ArticleStatus;
  ArticleType = ArticleType;

  constructor(
    injector: Injector,
    private _articlesService: ArticlesServiceProxy,
    private _tutorPortalService: TutorPortalService,
  ) {
    super(injector);
    this._tutorPortalService.article$.subscribe(article => {
      if (article && article.id) {
        this.model = article;
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
    request.parentIdFilter = this.model.id,
      request.searchFilter = this.searchFilter;
    request.statusFilter = this.statusFilter;

    this._articlesService
      .getAllForSeries(
        request.parentIdFilter,
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
