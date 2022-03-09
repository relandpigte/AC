import { Component, OnInit, Injector } from '@angular/core';
import { PagedAndSortedRequestDto, PagedListingComponentBase } from '@shared/paged-listing-component-base';
import { StudentArticleDto, ArticleType, ArticleStatus, StudentArticlesServiceProxy } from '@shared/service-proxies/service-proxies';
import { takeUntil, finalize } from 'rxjs/operators';
import * as _ from 'lodash';

class PagedStudentArticleRequestDto extends PagedAndSortedRequestDto {
  isSavedFilter: boolean;
}

@Component({
  selector: 'app-purchased',
  templateUrl: './purchased.component.html',
  styleUrls: ['./purchased.component.less']
})
export class PurchasedComponent extends PagedListingComponentBase<StudentArticleDto> implements OnInit {
  thumbnailUrls: string[] = [];
  models: StudentArticleDto[] = [];

  ArticleType = ArticleType;
  ArticleStatus = ArticleStatus;

  constructor(
    injector: Injector,
    private _studentArticlesService: StudentArticlesServiceProxy,
  ) {
    super(injector);
  }

  protected list(
    request: PagedStudentArticleRequestDto,
    pageNumber: number,
    finishedCallback: Function,
  ): void {
    request.isSavedFilter = false;

    this._studentArticlesService
      .getAll(
        request.isSavedFilter,
        request.skipCount,
        request.maxResultCount
      )
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          finishedCallback();
        })
      )
      .subscribe(result => {
        this.models = result.items;
        this.showPaging(result, pageNumber);
      });
  }
}
