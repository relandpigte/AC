import { Component, Injector, Input, OnInit } from '@angular/core';
import { CoachingService } from '@app/dashboard/coaching/_services/coaching.service';
import { UploadService } from '@app/_shared/services/upload.service';
import { PagedAndSortedRequestDto, PagedListingComponentBase } from '@shared/paged-listing-component-base';
import { CoachingDto, CoachingDtoPagedResultDto, CoachingsServiceProxy, CoachingStatus, CoachingType } from '@shared/service-proxies/service-proxies';
import * as _ from 'lodash';
import { finalize, takeUntil } from 'rxjs/operators';
import { ModalDialogOptions, ModalDialogService } from '@shared/services/modal-dialog.service';

class PagedCoachingRequestDto extends PagedAndSortedRequestDto {
  userIdFilter: number;
  searchFilter?: string;
  statusFilter?: CoachingStatus;
}

@Component({
  selector: 'app-programs',
  templateUrl: './programs.component.html',
  styleUrls: ['./programs.component.less']
})
export class ProgramsComponent extends PagedListingComponentBase<CoachingDto> implements OnInit {
  @Input() userId: number;

  nonce: number = Math.floor(Math.random() * 100) + 1;

  coachings: CoachingDto[] = [];
  searchFilter?: string;
  statusFilter?: number;
  thumbnailUrls: string[] = [];

  CoachingStatus = CoachingStatus;
  CoachingType = CoachingType;

  constructor(
    injector: Injector,
    private _coachingsService: CoachingsServiceProxy,
    private _coachingService: CoachingService,
    private _uploadService: UploadService,
    private _modalDialogService: ModalDialogService
  ) {
    super(injector);
    this._coachingService.coachingCreated$.subscribe(coaching => {
      if (coaching) {
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
      text: this.l('DeleteCoachingConfirmationMessage'),
      confirmCb: async (): Promise<void> => {
        await this._coachingsService.delete(id)
          .pipe(takeUntil(this.destroyed$), finalize(() => {
            this.notify.success(this.l('SuccessfullyDeleted'));
            this.refresh();
          }))
          .toPromise();
      }
    };
    this._modalDialogService.showConfirmDialog(options);
  }

  protected list(
    request: PagedCoachingRequestDto,
    pageNumber: number,
    finishedCallback: Function,
  ): void {
    request.userIdFilter = this.userId ?? this.appSession.userId;
    request.searchFilter = this.searchFilter;
    request.statusFilter = this.statusFilter;

    this._coachingsService
      .getAll(
        undefined,
        request.userIdFilter,
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
        _.each(this.coachings, coaching => {
          this.thumbnailUrls[coaching.id] = this._uploadService.getFileUrl(coaching.thumbnailDocument);
        });
        this.showPaging(result, pageNumber);
      });
  }
}
