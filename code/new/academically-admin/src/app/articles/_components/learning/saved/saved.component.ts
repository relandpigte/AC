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
  models: any[] = [];

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
        this.models = [{
          id: '93498324023049',
          articleId: '3432423',
          saveOnly: true,
          article : [{
            id: '23213',
            type: 1,
            name:  '23432432',
            description: '3423432',
            status: 0,
            parentId: '3434',
            thumbnailDocumentId: '334324',
            languageId: '3423423',
            isVisible: true,
            commentSetting: 1,
            commentModeration: true,
            customUrl: '3244',
            category: '34242',
            categories: '3432423',
            price: 1,
            pricingType: 1,
            delayType: 1,
            delayValue: '2323',
            parent: 0,
            thumbnailDocument: null,
            children: [],
          }]
        }];
        this.showPaging(result, pageNumber);
      });
  }
}
