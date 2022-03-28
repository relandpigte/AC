import { Component, OnInit, Injector } from '@angular/core';
import { PagedAndSortedRequestDto, PagedListingComponentBase } from '@shared/paged-listing-component-base';
import { StudentEventDto, EventType, EventStatus, EventsServiceProxy } from '@shared/service-proxies/service-proxies';
import { takeUntil, finalize } from 'rxjs/operators';

class PagedStudentEventRequestDto extends PagedAndSortedRequestDto {
  isSavedFilter: boolean;
}

@Component({
  selector: 'app-purchased',
  templateUrl: './purchased.component.html',
  styleUrls: ['./purchased.component.less']
})
export class PurchasedComponent extends PagedListingComponentBase<StudentEventDto> implements OnInit {
  thumbnailUrls: string[] = [];
  models: StudentEventDto[] = [];

  EventType = EventType;
  EventStatus = EventStatus;

  constructor(
    injector: Injector,
    private _eventsService: EventsServiceProxy,
  ) {
    super(injector);
  }

  protected list(
    request: PagedStudentEventRequestDto,
    pageNumber: number,
    finishedCallback: Function,
  ): void {
    request.isSavedFilter = false;

    this._eventsService
      .getAllPurchased(
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
