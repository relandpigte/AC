import { Component, Injector, OnInit } from '@angular/core';
import { WorkshopService } from '@app/dashboard/workshop/_services/workshop.service';
import { UploadService } from '@app/_shared/services/upload.service';
import { PagedAndSortedRequestDto, PagedListingComponentBase } from '@shared/paged-listing-component-base';
import { WorkshopStatus, WorkshopDto, WorkshopType, WorkshopsServiceProxy, WorkshopDtoPagedResultDto } from '@shared/service-proxies/service-proxies';
import * as _ from 'lodash';
import { takeUntil, finalize } from 'rxjs/operators';

class PagedWorkshopRequestDto extends PagedAndSortedRequestDto {
  userIdFilter: number;
  searchFilter?: string;
  statusFilter?: WorkshopStatus;
}

@Component({
  selector: 'app-programs',
  templateUrl: './programs.component.html',
  styleUrls: ['./programs.component.less']
})
export class ProgramsComponent extends PagedListingComponentBase<WorkshopDto> implements OnInit {
  nonce: number = Math.floor(Math.random() * 100) + 1;

  workshops: WorkshopDto[] = [];
  searchFilter?: string;
  statusFilter?: number;
  thumbnailUrls: string[] = [];

  Status = WorkshopStatus;
  WorkshopType = WorkshopType;

  constructor(
    injector: Injector,
    private _workshopsService: WorkshopsServiceProxy,
    private _workshopService: WorkshopService,
    private _uploadService: UploadService,
  ) {
    super(injector);
    this._workshopService.workshopCreated$.subscribe(workshop => {
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
    this.message.confirm(
      this.l('DeleteWorkshopConfirmationMessage'),
      undefined,
      (result: boolean) => {
        if (result) {
          this._workshopsService.delete(id)
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
        request.statusFilter,
        request.skipCount,
        request.maxResultCount
      )
      .pipe(
        finalize(() => {
          finishedCallback();
        })
      )
      .subscribe((result: WorkshopDtoPagedResultDto) => {
        this.workshops = result.items;
        _.each(this.workshops, workshop => {
          this.thumbnailUrls[workshop.id] = this._uploadService.getFileUrl(workshop.thumbnailDocument);
        });
        this.showPaging(result, pageNumber);
      });
  }
}
