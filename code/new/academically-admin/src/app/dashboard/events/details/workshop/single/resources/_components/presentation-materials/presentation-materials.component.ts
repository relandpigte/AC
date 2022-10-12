import { Component, OnInit, Injector } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { UploadPresentationMaterialComponent } from '../upload-presentation-material/upload-presentation-material.component';
import { takeUntil, finalize, filter } from 'rxjs/operators';
import { WorkshopDto, WorkshopResourcesServiceProxy, WorkshopResourceDto, WorkshopResourceType } from '@shared/service-proxies/service-proxies';
import { WorkshopService } from '@app/dashboard/events/_services/workshop.service';
import { PagedListingComponentBase, PagedAndSortedRequestDto } from '@shared/paged-listing-component-base';
import { UploadService } from '@app/_shared/services/upload.service';

class PagedWorkshopResourceRequestDto extends PagedAndSortedRequestDto {
  workshopIdFilter: string;
  presentationMaterialOnlyFilter: boolean;
  handoutsOnlyFilter: boolean;
}

@Component({
  selector: 'app-presentation-materials',
  templateUrl: './presentation-materials.component.html',
  styleUrls: ['./presentation-materials.component.less']
})
export class PresentationMaterialsComponent extends PagedListingComponentBase<WorkshopResourceDto> implements OnInit {
  workshop = new WorkshopDto();
  workshopResources: WorkshopResourceDto[] = [];
  isLoading = false;

  WorkshopResourceType = WorkshopResourceType;

  constructor(
    injector: Injector,
    private _modalService: BsModalService,
    private _workshopService: WorkshopService,
    private _uploadService: UploadService,
    private _workshopResourcesService: WorkshopResourcesServiceProxy,
  ) {
    super(injector);
    this._workshopService.workshopCreated$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        if (response) {
          this.workshop = response;
          this.refresh();
        }
      });
  }

  onAddClick(): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<UploadPresentationMaterialComponent>;
    modalSettings.initialState = {
      workshopId: this.workshop.id,
    };
    const modal = this._modalService.show(UploadPresentationMaterialComponent, modalSettings).content;
    modal.modelSaved
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        this.refresh();
      });
  }

  onDeleteClick(workshopResource: WorkshopResourceDto): void {
    this.message.confirm(this.l('DeleteWorkshopResourceConfirmationMessage'), undefined, (result => {
      if (result) {
        this.isLoading = true;
        this._uploadService.delete(workshopResource.document, workshopResource.id)
          .pipe(takeUntil(this.destroyed$))
          .subscribe(() => {
            this._workshopResourcesService.delete(workshopResource.id)
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
    }));
  }

  protected list(
    request: PagedWorkshopResourceRequestDto,
    pageNumber: number,
    finishedCallback: Function,
  ): void {
    if (this.workshop.id) {
      this.isLoading = true;
      request.sort = 'name';
      request.workshopIdFilter = this.workshop.id;
      request.presentationMaterialOnlyFilter = true;
      request.handoutsOnlyFilter = false;

      this._workshopResourcesService
        .getAll(
          request.workshopIdFilter,
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
          this.workshopResources = result.items;
          this.showPaging(result, pageNumber);
        });
    }
  }
}
