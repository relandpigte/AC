import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventService } from '@app/events/_services/event.service';
import { UploadService } from '@app/_shared/services/upload.service';
import { PagedAndSortedRequestDto, PagedListingComponentBase } from '@shared/paged-listing-component-base';
import { EventDto, EventStatus, EventType, EventsServiceProxy, EventDtoPagedResultDto } from '@shared/service-proxies/service-proxies';
import * as _ from 'lodash';
import { finalize } from 'rxjs/operators';

class PagedEventRequestDto extends PagedAndSortedRequestDto {
  parentIdFilter: string;
  searchFilter?: string;
  statusFilter?: EventStatus;
}

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.less']
})
export class EventsComponent extends PagedListingComponentBase<EventDto> implements OnInit {
  parentId: string;
  events: EventDto[] = [];
  searchFilter?: string;
  statusFilter?: number;
  thumbnailUrls: string[] = [];

  EventStatus = EventStatus;
  EventType = EventType;

  constructor(
    injector: Injector,
    route: ActivatedRoute,
    private _eventsService: EventsServiceProxy,
    private _eventService: EventService,
    private _uploadService: UploadService,
  ) {
    super(injector);
    this._eventService.eventCreated$.subscribe(event => {
      if (event) {
        this.refresh();
      }
    });
    route.parent.parent.paramMap.subscribe(paramMap => {
      if (paramMap.has('parent-id')) {
        this.parentId = paramMap.get('parent-id');
      }
    });
  }

  onClearFiltersClick(): void {
    this.searchFilter = undefined;
    this.statusFilter = undefined;
  }

  protected list(
    request: PagedEventRequestDto,
    pageNumber: number,
    finishedCallback: Function,
  ): void {
    request.parentIdFilter = this.parentId;
    request.searchFilter = this.searchFilter;
    request.statusFilter = this.statusFilter;

    this._eventsService
      .getAll(
        request.parentIdFilter,
        undefined,
        request.searchFilter,
        undefined,
        undefined,
        request.statusFilter,
        request.skipCount,
        request.maxResultCount
      )
      .pipe(
        finalize(() => {
          finishedCallback();
        })
      )
      .subscribe((result: EventDtoPagedResultDto) => {
        this.events = result.items;
        _.each(this.events, event => {
          this.thumbnailUrls[event.id] = this._uploadService.getFileUrl(event.thumbnailDocument);
        });
        this.showPaging(result, pageNumber);
      });
  }
}
