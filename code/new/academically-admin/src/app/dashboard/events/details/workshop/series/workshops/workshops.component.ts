import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventService } from '@app/dashboard/events/_services/event.service';
import { UploadService } from '@app/_shared/services/upload.service';
import { PagedAndSortedRequestDto, PagedListingComponentBase } from '@shared/paged-listing-component-base';
import { EventCategory, EventDto, EventDtoPagedResultDto, EventsServiceProxy, EventStatus, EventType } from '@shared/service-proxies/service-proxies';
import * as _ from 'lodash';
import { finalize } from 'rxjs/operators';

class PagedWorkshopRequestDto extends PagedAndSortedRequestDto {
  parentIdFilter: string;
  searchFilter?: string;
  statusFilter?: EventStatus;
}

@Component({
  selector: 'app-workshops',
  templateUrl: './workshops.component.html',
  styleUrls: ['./workshops.component.less']
})
export class WorkshopsComponent extends PagedListingComponentBase<EventDto> implements OnInit {
  parentId: string;
  workshops: EventDto[] = [];
  searchFilter?: string;
  statusFilter?: number;
  thumbnailUrls: string[] = [];

  WorkshopStatus = EventStatus;
  WorkshopType = EventType;

  constructor(
    injector: Injector,
    route: ActivatedRoute,
    private _workshopsService: EventsServiceProxy,
    private _workshopService: EventService,
    private _uploadService: UploadService,
  ) {
    super(injector);
    this._workshopService.eventCreated$.subscribe(workshop => {
      if (workshop) {
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
    request: PagedWorkshopRequestDto,
    pageNumber: number,
    finishedCallback: Function,
  ): void {
    request.parentIdFilter = this.parentId;
    request.searchFilter = this.searchFilter;
    request.statusFilter = this.statusFilter;

    this._workshopsService
      .getAll(
        request.parentIdFilter,
        undefined,
        request.searchFilter,
        true,
        true,
        request.statusFilter,
        EventCategory.Workshop,
        request.skipCount,
        request.maxResultCount
      )
      .pipe(
        finalize(() => {
          finishedCallback();
        })
      )
      .subscribe((result: EventDtoPagedResultDto) => {
        this.workshops = result.items;
        _.each(this.workshops, async workshop => {
          this.thumbnailUrls[workshop.id] = await this._uploadService.getFileUrl(workshop.thumbnailDocument);
        });
        this.showPaging(result, pageNumber);
      });
  }
}
