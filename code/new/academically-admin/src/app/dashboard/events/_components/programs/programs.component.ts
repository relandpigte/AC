import { Component, Injector, OnInit } from '@angular/core';
import { UploadService } from '@app/_shared/services/upload.service';
import { PagedAndSortedRequestDto, PagedListingComponentBase } from '@shared/paged-listing-component-base';
import { EventCategory, EventDto, EventDtoPagedResultDto, EventsServiceProxy, EventStatus, EventType } from '@shared/service-proxies/service-proxies';
import * as _ from 'lodash';
import { finalize, takeUntil } from 'rxjs/operators';
import { EventService } from '../../_services/event.service';
import { ModalDialogOptions, ModalDialogService } from '@shared/services/modal-dialog.service';

class PagedWorkshopRequestDto extends PagedAndSortedRequestDto {
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

  workshops: EventDto[] = [];
  searchFilter?: string;
  statusFilter?: number;
  thumbnailUrls: string[] = [];

  Status = EventStatus;
  WorkshopType = EventType;

  constructor(
    injector: Injector,
    private _workshopsService: EventsServiceProxy,
    private _workshopService: EventService,
    private _uploadService: UploadService,
    private _modalDialogService: ModalDialogService
  ) {
    super(injector);
    this._workshopService.eventCreated$.subscribe(workshop => {
      if (workshop) {
        this.refresh();
      }
    });
  }

  onClearFiltersClick(): void {
    this.searchFilter = undefined;
    this.statusFilter = undefined;
  }

  onDeleteClick(id: string): void {
    const options: ModalDialogOptions = {
      title: this.l('AreYouSure'),
      text: this.l('DeleteWorkshopConfirmationMessage'),
      confirmCb: (): void => {
        this._workshopsService.delete(id)
          .pipe(takeUntil(this.destroyed$))
          .subscribe(() => {
            this.notify.success(this.l('SuccessfullyDeleted'));
            this.refresh();
          });
      }
    };
    this._modalDialogService.showConfirmDialog(options);
  }

  protected list(
    request: PagedWorkshopRequestDto,
    pageNumber: number,
    finishedCallback: Function,
  ): void {
    request.userIdFilter = this.appSession.userId;
    request.searchFilter = this.searchFilter;
    request.statusFilter = this.statusFilter;

    this._workshopsService
      .getAll(
        undefined,
        request.userIdFilter,
        request.searchFilter,
        undefined,
        undefined,
        request.statusFilter,
        undefined,
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
