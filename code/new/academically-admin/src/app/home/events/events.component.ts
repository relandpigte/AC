import { Component, OnInit, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { EventDto, EventsServiceProxy, EventStatus } from '@shared/service-proxies/service-proxies';
import { PagedListingComponentBase, PagedAndSortedRequestDto } from '@shared/paged-listing-component-base';
import { takeUntil, finalize } from 'rxjs/operators';

class PagedEventRequestDto extends PagedAndSortedRequestDto {
  isSavedFilter: boolean;
}

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.less']
})
export class EventsComponent extends PagedListingComponentBase<EventDto> implements OnInit {
  events: EventDto[] = [];
  loading = true;

  constructor(
    injector: Injector,
    private _router: Router,
    private _eventsService: EventsServiceProxy,
  ) {
    super(injector);
  }

  onViewEvent(event: EventDto): void {
    this._router.navigate(['/app/dashboard/events/portal/broadcast/student', event.id, 'portal']);
  }

  protected list(
    request: PagedEventRequestDto,
    pageNumber: number,
    finishedCallback: Function,
  ): void {
    this.loading = true;
    request.isSavedFilter = false;

    this._eventsService
      .getAll(
        undefined,
        undefined,
        undefined,
        true,
        true,
        EventStatus.Published,
        request.skipCount,
        request.maxResultCount,
      )
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          finishedCallback();
          this.loading = false;
        })
      )
      .subscribe(result => {
        this.events = result.items;
        this.showPaging(result, pageNumber);
      });
  }
}
