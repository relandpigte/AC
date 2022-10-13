import { Component, OnInit, Injector, Input } from '@angular/core';
import { EventsServiceProxy, EventInstanceDto, EventInstanceDtoPagedResultDto } from '@shared/service-proxies/service-proxies';
import { finalize, takeUntil } from 'rxjs/operators';
import { PagedAndSortedRequestDto, PagedListingComponentBase } from '@shared/paged-listing-component-base';

class PagedEventInstanceRequestDto extends PagedAndSortedRequestDto {
  eventIdFilter: string;
  pastFilter: boolean;
}

@Component({
  selector: 'app-upcoming',
  templateUrl: './upcoming.component.html',
  styleUrls: ['./upcoming.component.less']
})
export class UpcomingComponent extends PagedListingComponentBase<EventInstanceDto> {
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
    request.pastFilter = false;

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
