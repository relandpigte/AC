import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WorkshopService } from '@app/dashboard/workshop/_services/workshop.service';
import { UploadService } from '@app/_shared/services/upload.service';
import { PagedAndSortedRequestDto, PagedListingComponentBase } from '@shared/paged-listing-component-base';
import { WorkshopDto, WorkshopStatus, WorkshopType, WorkshopsServiceProxy, WorkshopDtoPagedResultDto } from '@shared/service-proxies/service-proxies';
import * as _ from 'lodash';
import { finalize } from 'rxjs/operators';

class PagedWorkshopRequestDto extends PagedAndSortedRequestDto {
  parentIdFilter: string;
  searchFilter?: string;
  statusFilter?: WorkshopStatus;
}

@Component({
  selector: 'app-workshops',
  templateUrl: './workshops.component.html',
  styleUrls: ['./workshops.component.less']
})
export class WorkshopsComponent extends PagedListingComponentBase<WorkshopDto> implements OnInit {
  parentId: string;
  workshops: WorkshopDto[] = [];
  searchFilter?: string;
  statusFilter?: number;
  thumbnailUrls: string[] = [];

  WorkshopStatus = WorkshopStatus;
  WorkshopType = WorkshopType;

  constructor(
    injector: Injector,
    route: ActivatedRoute,
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
