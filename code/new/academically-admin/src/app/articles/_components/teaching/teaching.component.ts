import { Component, OnInit, Injector } from '@angular/core';
import { ArticleDto, ArticleStatus, ArticleType, ArticlesServiceProxy, ArticleDtoPagedResultDto } from '@shared/service-proxies/service-proxies';
import { PagedAndSortedRequestDto, PagedListingComponentBase } from '@shared/paged-listing-component-base';
import { ArticleService } from '@app/articles/_services/article.service';
import { finalize, takeUntil } from 'rxjs/operators';
import { UploadService } from '@app/_shared/services/upload.service';
import * as _ from 'lodash';
import { Router } from '@angular/router';

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
  thumbnailUrls: string[] = [];

  ArticleStatus = ArticleStatus;
  ArticleType = ArticleType;

  constructor(
    injector: Injector,
    private _articlesService: ArticlesServiceProxy,
    private _articleService: ArticleService,
    private _uploadService: UploadService,
    private router: Router,
  ) {
    super(injector);
    this._articleService.articleCreated$.subscribe(article => {
      if (article) {
        this.refresh();
      }
    });
  }


  nav(url, id) {
    this.router.navigate([url , id]);
  }



  onClearFiltersClick(): void {
    this.searchFilter = undefined;
    this.statusFilter = undefined;
  }

  onDeleteClick(id: string): void {
    this.message.confirm(
      this.l('DeleteArticleConfirmationMessage'),
      undefined,
      (result: boolean) => {
        if (result) {
          this._articlesService.delete(id)
            .pipe(takeUntil(this.destroyed$))
            .subscribe(() => {
              this.notify.success(this.l('SuccessfullyDeleted'));
              this.refresh();
            });
        }
      }
    );
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
        undefined,
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
        _.each(this.articles, article => {
          this.thumbnailUrls[article.id] = this._uploadService.getFileUrl(article.thumbnailDocument);
        });
        this.showPaging(result, pageNumber);
      });
  }
}
