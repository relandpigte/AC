import { Component, OnInit, Injector } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { UploadPresentationMaterialComponent } from '../upload-presentation-material/upload-presentation-material.component';
import { takeUntil, finalize, filter } from 'rxjs/operators';
import { CoachingDto, CoachingResourcesServiceProxy, CoachingResourceDto, CoachingResourceType } from '@shared/service-proxies/service-proxies';
import { CoachingService } from '@app/dashboard/coaching/_services/coaching.service';
import { PagedListingComponentBase, PagedAndSortedRequestDto } from '@shared/paged-listing-component-base';
import { UploadService } from '@app/_shared/services/upload.service';
import { ModalDialogOptions, ModalDialogService } from '@shared/services/modal-dialog.service';

class PagedCoachingResourceRequestDto extends PagedAndSortedRequestDto {
  coachingIdFilter: string;
  presentationMaterialOnlyFilter: boolean;
  handoutsOnlyFilter: boolean;
}

@Component({
  selector: 'app-presentation-materials',
  templateUrl: './presentation-materials.component.html',
  styleUrls: ['./presentation-materials.component.less']
})
export class PresentationMaterialsComponent extends PagedListingComponentBase<CoachingResourceDto> implements OnInit {
  coaching = new CoachingDto();
  coachingResources: CoachingResourceDto[] = [];
  isLoading = false;

  CoachingResourceType = CoachingResourceType;

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

  onAddClick(): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<UploadPresentationMaterialComponent>;
    modalSettings.initialState = {
      coachingId: this.coaching.id,
    };
    const modal = this._modalService.show(UploadPresentationMaterialComponent, modalSettings).content;
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
      request.presentationMaterialOnlyFilter = true;
      request.handoutsOnlyFilter = false;

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
