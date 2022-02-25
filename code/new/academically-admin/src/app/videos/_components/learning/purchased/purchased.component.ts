import { Component, OnInit, Injector } from '@angular/core';
import { PagedAndSortedRequestDto, PagedListingComponentBase } from '@shared/paged-listing-component-base';
import { StudentVideoDto, VideoType, VideoStatus, StudentVideosServiceProxy } from '@shared/service-proxies/service-proxies';
import { takeUntil, finalize } from 'rxjs/operators';
import * as _ from 'lodash';

class PagedStudentVideoRequestDto extends PagedAndSortedRequestDto {
  isSavedFilter: boolean;
}

@Component({
  selector: 'app-purchased',
  templateUrl: './purchased.component.html',
  styleUrls: ['./purchased.component.less']
})
export class PurchasedComponent extends PagedListingComponentBase<StudentVideoDto> implements OnInit {
  thumbnailUrls: string[] = [];
  models: StudentVideoDto[] = [];

  VideoType = VideoType;
  VideoStatus = VideoStatus;

  constructor(
    injector: Injector,
    private _studentVideosService: StudentVideosServiceProxy,
  ) {
    super(injector);
  }

  protected list(
    request: PagedStudentVideoRequestDto,
    pageNumber: number,
    finishedCallback: Function,
  ): void {
    request.isSavedFilter = false;

    this._studentVideosService
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
