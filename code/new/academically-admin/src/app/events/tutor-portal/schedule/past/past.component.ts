import { Component, OnInit, Input, Injector } from '@angular/core';
import { PagedAndSortedRequestDto, PagedListingComponentBase } from '@shared/paged-listing-component-base';
import { EventInstanceDto, EventsServiceProxy, EventInstanceDtoPagedResultDto } from '@shared/service-proxies/service-proxies';
import { takeUntil, finalize } from 'rxjs/operators';

class PagedEventInstanceRequestDto extends PagedAndSortedRequestDto {
  eventIdFilter: string;
  pastFilter: boolean;
}

@Component({
  selector: 'app-past',
  templateUrl: './past.component.html',
  styleUrls: ['./past.component.less']
})
export class PastComponent extends PagedListingComponentBase<EventInstanceDto> {
  @Input() eventId: string;
  eventInstances: EventInstanceDto[] = [];

  constructor(
    injector: Injector,
    private _eventsService: EventsServiceProxy,
  ) {
    super(injector);
  }

  protected list(
    request: PagedEventInstanceRequestDto,
    pageNumber: number,
    finishedCallback: Function,
  ): void {
    console.log('test');
    request.eventIdFilter = this.eventId;
    request.pastFilter = true;

    this._eventsService
      .getAllEventInstances(
        request.eventIdFilter,
        request.pastFilter,
        request.skipCount,
        request.maxResultCount
      )
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          finishedCallback();
        }),
      )
      .subscribe((result: EventInstanceDtoPagedResultDto) => {
        this.eventInstances = result.items;
        this.showPaging(result, pageNumber);
      });
  }
}
