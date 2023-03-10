import { Component, Injector, OnInit } from '@angular/core';
import { EventService } from '@app/dashboard/events/_services/event.service';
import { UploadService } from '@app/_shared/services/upload.service';
import { PagedAndSortedRequestDto, PagedListingComponentBase } from '@shared/paged-listing-component-base';
import { EventDto, EventResourceDto, EventResourcesServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { finalize, takeUntil } from 'rxjs/operators';
import { UploadHandoutComponent } from '../upload-handout/upload-handout.component';

class PagedWorkshopResourceRequestDto extends PagedAndSortedRequestDto {
  workshopIdFilter: string;
  presentationMaterialOnlyFilter: boolean;
  handoutsOnlyFilter: boolean;
}

@Component({
  selector: 'app-handouts',
  templateUrl: './handouts.component.html',
  styleUrls: ['./handouts.component.less']
})
export class HandoutsComponent extends PagedListingComponentBase<EventResourceDto> implements OnInit {
  workshop = new EventDto();
  workshopResources: EventResourceDto[] = [];
  isLoading = false;

  constructor(
    injector: Injector,
    private _modalService: BsModalService,
    private _workshopService: EventService,
    private _uploadService: UploadService,
    private _workshopResourcesService: EventResourcesServiceProxy
  ) {
    super(injector);
    this._workshopService.eventCreated$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        if (response) {
          this.workshop = response;
          this.refresh();
        }
      });
  }

  ngOnInit(): void {
  }

  onAddClick(): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<UploadHandoutComponent>;
    modalSettings.initialState = { workshopId: this.workshop.id };
    const modal = this._modalService.show(UploadHandoutComponent, modalSettings).content;
    modal.modelSaved
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        this.refresh();
      });
  }

  onDeleteClick(workshopResource: EventResourceDto): void {
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
      request.presentationMaterialOnlyFilter = false;
      request.handoutsOnlyFilter = true;

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
