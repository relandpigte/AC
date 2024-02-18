import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoachingService } from '@app/dashboard/coaching/_services/coaching.service';
import { UploadService } from '@app/_shared/services/upload.service';
import { PagedAndSortedRequestDto, PagedListingComponentBase } from '@shared/paged-listing-component-base';
import { CoachingDto, CoachingStatus, CoachingType, CoachingsServiceProxy, CoachingDtoPagedResultDto } from '@shared/service-proxies/service-proxies';
import * as _ from 'lodash';
import { finalize } from 'rxjs/operators';

class PagedCoachingRequestDto extends PagedAndSortedRequestDto {
  parentIdFilter: string;
  searchFilter?: string;
  statusFilter?: CoachingStatus;
}

@Component({
  selector: 'app-coachings',
  templateUrl: './coachings.component.html',
  styleUrls: ['./coachings.component.less']
})
export class CoachingsComponent extends PagedListingComponentBase<CoachingDto> implements OnInit {
  parentId: string;
  coachings: CoachingDto[] = [];
  searchFilter?: string;
  statusFilter?: number;
  thumbnailUrls: string[] = [];

  CoachingStatus = CoachingStatus;
  CoachingType = CoachingType;

  constructor(
    injector: Injector,
    route: ActivatedRoute,
    private _coachingsService: CoachingsServiceProxy,
    private _coachingService: CoachingService,
    private _uploadService: UploadService,
  ) {
    super(injector);
    this._coachingService.coachingCreated$.subscribe(coaching => {
      if (coaching) {
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
    request: PagedCoachingRequestDto,
    pageNumber: number,
    finishedCallback: Function,
  ): void {
    request.parentIdFilter = this.parentId;
    request.searchFilter = this.searchFilter;
    request.statusFilter = this.statusFilter;

    this._coachingsService
      .getAll(
        request.parentIdFilter,
        undefined,
        request.searchFilter,
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
      .subscribe((result: CoachingDtoPagedResultDto) => {
        this.coachings = result.items;
        _.each(this.coachings, async coaching => {
          this.thumbnailUrls[coaching.id] = await this._uploadService.getFileUrl(coaching.thumbnailDocument);
        });
        this.showPaging(result, pageNumber);
      });
  }
}
