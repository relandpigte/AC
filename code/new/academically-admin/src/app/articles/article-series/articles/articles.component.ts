import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArticleService } from '@app/articles/_services/article.service';
import { UploadService } from '@app/_shared/services/upload.service';
import { PagedAndSortedRequestDto, PagedListingComponentBase } from '@shared/paged-listing-component-base';
import { ArticleStatus, ArticleDto, ArticleType, ArticlesServiceProxy, ArticleDtoPagedResultDto } from '@shared/service-proxies/service-proxies';
import * as _ from 'lodash';
import { finalize } from 'rxjs/operators';

class PagedArticleRequestDto extends PagedAndSortedRequestDto {
  parentIdFilter: string;
  searchFilter?: string;
  statusFilter?: ArticleStatus;
}

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.less']
})
export class ArticlesComponent extends PagedListingComponentBase<ArticleDto> implements OnInit {
  parentId: string;
  articles: ArticleDto[] = [];
  searchFilter?: string;
  statusFilter?: number;
  thumbnailUrls: string[] = [];

  ArticleStatus = ArticleStatus;
  ArticleType = ArticleType;

  constructor(
    injector: Injector,
    route: ActivatedRoute,
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
    route.parent.parent.paramMap.subscribe(paramMap => {
      if (paramMap.has('parent-id')) {
        this.parentId = paramMap.get('parent-id');
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
    request.parentIdFilter = this.parentId;
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
        _.each(this.articles, async article => {
          this.thumbnailUrls[article.id] = await this._uploadService.getFileUrl(article.thumbnailDocument);
        });
        this.showPaging(result, pageNumber);
      });
  }
}
