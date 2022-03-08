import { Component, OnInit, Injector } from '@angular/core';
import { PagedAndSortedRequestDto, PagedListingComponentBase } from '@shared/paged-listing-component-base';
import { StudentArticleDto, ArticleType, ArticleStatus, StudentArticlesServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize, takeUntil } from 'rxjs/operators';

class PagedStudentArticleRequestDto extends PagedAndSortedRequestDto {
  isSavedFilter: boolean;
}

@Component({
  selector: 'app-saved',
  templateUrl: './saved.component.html',
  styleUrls: ['./saved.component.less']
})
export class SavedComponent extends PagedListingComponentBase<StudentArticleDto> implements OnInit {
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
    request.isSavedFilter = true;

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
