import { Component, Injector, OnInit } from '@angular/core';
import { EventService } from '@app/events/_services/event.service';
import { UploadService } from '@app/_shared/services/upload.service';
import { PagedAndSortedRequestDto, PagedListingComponentBase } from '@shared/paged-listing-component-base';
import { EventStatus, EventDto, EventType, EventsServiceProxy, EventDtoPagedResultDto } from '@shared/service-proxies/service-proxies';
import * as _ from 'lodash';
import { takeUntil, finalize } from 'rxjs/operators';

class PagedEventRequestDto extends PagedAndSortedRequestDto {
  userIdFilter: number;
  searchFilter?: string;
  statusFilter?: EventStatus;
}

@Component({
  selector: 'app-programs',
  templateUrl: './programs.component.html',
  styleUrls: ['./programs.component.less']
})
export class ProgramsComponent extends PagedListingComponentBase<EventDto> implements OnInit {
  nonce: number = Math.floor(Math.random() * 100) + 1;

  events: EventDto[] = [];
  searchFilter?: string;
  statusFilter?: number;
  thumbnailUrls: string[] = [];

  EventStatus = EventStatus;
  EventType = EventType;

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
    this.searchFilter = undefined;
    this.statusFilter = undefined;
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
    request.searchFilter = this.searchFilter;
    request.statusFilter = this.statusFilter;

    this._eventsService
      .getAll(
        undefined,
        request.userIdFilter,
        request.searchFilter,
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
