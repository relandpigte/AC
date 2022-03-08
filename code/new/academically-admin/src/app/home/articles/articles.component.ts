import { Component, Injector, OnInit } from '@angular/core';
import { ArticleService } from '@app/articles/_services/article.service';
import { UploadService } from '@app/_shared/services/upload.service';
import { PagedAndSortedRequestDto, PagedListingComponentBase } from '@shared/paged-listing-component-base';
import { ArticleDto, ArticleStatus, ArticleType, ArticlesServiceProxy, ArticleDtoPagedResultDto } from '@shared/service-proxies/service-proxies';
import * as _ from 'lodash';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.less']
})
export class ArticlesComponent extends PagedListingComponentBase<ArticleDto> implements OnInit {
  articles: ArticleDto[] = [];
  searchFilter?: string;
  statusFilter?: number;

  ArticleStatus = ArticleStatus;
  ArticleType = ArticleType;

  constructor(
    injector: Injector,
    private _articlesService: ArticlesServiceProxy,
    private _articleService: ArticleService,
    private _uploadService: UploadService,
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
    request: PagedAndSortedRequestDto,
    pageNumber: number,
    finishedCallback: Function,
  ): void {

    this._articlesService
      .getAllForHome(
        request.maxResultCount,
        request.skipCount,
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
