import { Component, Injector, OnInit } from '@angular/core';
import { EventService } from '@app/events/_services/event.service';
import { UploadService } from '@app/_shared/services/upload.service';
import { PagedAndSortedRequestDto, PagedListingComponentBase } from '@shared/paged-listing-component-base';
import { EventDto, EventsServiceProxy, EventDtoPagedResultDto, EventScheduleFilter } from '@shared/service-proxies/service-proxies';
import * as _ from 'lodash';
import { takeUntil, finalize } from 'rxjs/operators';

class PagedEventRequestDto extends PagedAndSortedRequestDto {
  userIdFilter: number;
  scheduleFilter?: number;
}

@Component({
  selector: 'app-schedule-list',
  templateUrl: './schedule-list.component.html',
  styleUrls: ['./schedule-list.component.less']
})
export class ScheduleListComponent extends PagedListingComponentBase<EventDto> implements OnInit {
  events: EventDto[] = [];
  scheduleFilter?: EventScheduleFilter;
  thumbnailUrls: string[] = [];

  EventScheduleFilter = EventScheduleFilter;

  constructor(
    injector: Injector,
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
  }

  onClearFiltersClick(): void {
    this.scheduleFilter = undefined;
  }

  onDeleteClick(id: string): void {
    this.message.confirm(
      this.l('DeleteEventConfirmationMessage'),
      undefined,
      (result: boolean) => {
        if (result) {
          this._eventsService.delete(id)
            .pipe(takeUntil(this.destroyed$))
            .subscribe(() => {
              this.notify.success(this.l('SuccessfullyDeleted'));
              this.refresh();
            });
        }
      }
    );
  }

  protected list(
    request: PagedEventRequestDto,
    pageNumber: number,
    finishedCallback: Function,
  ): void {
    request.userIdFilter = this.appSession.userId;
    request.scheduleFilter = this.scheduleFilter;

    this._eventsService
      .getEventSchedules(
        request.userIdFilter,
        request.scheduleFilter,
        request.skipCount,
        request.maxResultCount,
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
