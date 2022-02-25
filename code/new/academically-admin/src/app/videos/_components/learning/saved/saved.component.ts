import { Component, OnInit, Injector } from '@angular/core';
import { PagedAndSortedRequestDto, PagedListingComponentBase } from '@shared/paged-listing-component-base';
import { StudentVideoDto, VideoType, VideoStatus, StudentVideosServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize, takeUntil } from 'rxjs/operators';

class PagedStudentVideoRequestDto extends PagedAndSortedRequestDto {
  isSavedFilter: boolean;
}

@Component({
  selector: 'app-saved',
  templateUrl: './saved.component.html',
  styleUrls: ['./saved.component.less']
})
export class SavedComponent extends PagedListingComponentBase<StudentVideoDto> implements OnInit {
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
    request.isSavedFilter = true;

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
