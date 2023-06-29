import { Component, OnInit, Injector } from '@angular/core';
import { ModalOptions, BsModalService } from 'ngx-bootstrap/modal';
import { UploadHandoutComponent } from '../upload-handout/upload-handout.component';
import { CoachingDto, CoachingResourceDto, CoachingResourcesServiceProxy } from '@shared/service-proxies/service-proxies';
import { CoachingService } from '@app/dashboard/coaching/_services/coaching.service';
import { takeUntil, finalize } from 'rxjs/operators';
import { PagedListingComponentBase, PagedAndSortedRequestDto } from '@shared/paged-listing-component-base';
import { UploadService } from '@app/_shared/services/upload.service';
import { ModalDialogOptions, ModalDialogService } from '@shared/services/modal-dialog.service';

class PagedCoachingResourceRequestDto extends PagedAndSortedRequestDto {
  coachingIdFilter: string;
  presentationMaterialOnlyFilter: boolean;
  handoutsOnlyFilter: boolean;
}

@Component({
  selector: 'app-handouts',
  templateUrl: './handouts.component.html',
  styleUrls: ['./handouts.component.less']
})
export class HandoutsComponent extends PagedListingComponentBase<CoachingResourceDto> implements OnInit {
  coaching = new CoachingDto();
  coachingResources: CoachingResourceDto[] = [];
  isLoading = false;

  constructor(
    injector: Injector,
    private _modalService: BsModalService,
    private _coachingService: CoachingService,
    private _uploadService: UploadService,
    private _coachingResourcesService: CoachingResourcesServiceProxy,
    private _modalDialogService: ModalDialogService
  ) {
    super(injector);
    this._coachingService.coachingCreated$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        if (response) {
          this.coaching = response;
          this.refresh();
        }
      });
  }

  ngOnInit(): void {
  }

  onAddClick(): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<UploadHandoutComponent>;
    modalSettings.initialState = { coachingId: this.coaching.id };
    const modal = this._modalService.show(UploadHandoutComponent, modalSettings).content;
    modal.modelSaved
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        this.refresh();
      });
  }

  onDeleteClick(coachingResource: CoachingResourceDto): void {
    const options: ModalDialogOptions = {
      title: this.l('AreYouSure'),
      text: this.l('DeleteCoachingResourceConfirmationMessage'),
      confirmCb: (): void => {
        this.isLoading = true;
        this._uploadService.delete(coachingResource.document, coachingResource.id)
          .pipe(takeUntil(this.destroyed$))
          .subscribe(() => {
            this._coachingResourcesService.delete(coachingResource.id)
              .pipe(
                takeUntil(this.destroyed$),
                finalize(() => {
                  this.isLoading = false;
                })
              )
              .subscribe(() => {
                this.notify.success(this.l('SuccessfullyDeleted'));
                this.pageNumber = 1;
                this.refresh();
              });
          });
      }
    };
    this._modalDialogService.showConfirmDialog(options);
  }

  protected list(
    request: PagedCoachingResourceRequestDto,
    pageNumber: number,
    finishedCallback: Function,
  ): void {
    if (this.coaching.id) {
      this.isLoading = true;
      request.sort = 'name';
      request.coachingIdFilter = this.coaching.id;
      request.presentationMaterialOnlyFilter = false;
      request.handoutsOnlyFilter = true;

      this._coachingResourcesService
        .getAll(
          request.coachingIdFilter,
          request.presentationMaterialOnlyFilter,
          request.handoutsOnlyFilter,
          request.sort,
          request.skipCount,
          request.maxResultCount
        )
        .pipe(
          finalize(() => {
            finishedCallback();
            this.isLoading = false;
          })
        )
        .subscribe(result => {
          this.coachingResources = result.items;
          this.showPaging(result, pageNumber);
        });
    }
  }
}
