import { Component, OnInit, Injector } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { UploadPresentationMaterialComponent } from '../upload-presentation-material/upload-presentation-material.component';
import { takeUntil, finalize, filter } from 'rxjs/operators';
import { EventDto, EventResourcesServiceProxy, EventResourceDto, EventResourceType } from '@shared/service-proxies/service-proxies';
import { EventService } from '@app/dashboard/events/_services/event.service';
import { PagedListingComponentBase, PagedAndSortedRequestDto } from '@shared/paged-listing-component-base';
import { UploadService } from '@app/_shared/services/upload.service';

class PagedEventResourceRequestDto extends PagedAndSortedRequestDto {
  eventIdFilter: string;
  presentationMaterialOnlyFilter: boolean;
  handoutsOnlyFilter: boolean;
}

@Component({
  selector: 'app-presentation-materials',
  templateUrl: './presentation-materials.component.html',
  styleUrls: ['./presentation-materials.component.less']
})
export class PresentationMaterialsComponent extends PagedListingComponentBase<EventResourceDto> implements OnInit {
  event = new EventDto();
  eventResources: EventResourceDto[] = [];
  isLoading = false;

  EventResourceType = EventResourceType;

  constructor(
    injector: Injector,
    private _modalService: BsModalService,
    private _eventService: EventService,
    private _uploadService: UploadService,
    private _eventResourcesService: EventResourcesServiceProxy,
  ) {
    super(injector);
    this._eventService.eventCreated$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        if (response) {
          this.event = response;
          this.refresh();
        }
      });
  }

  onAddClick(): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<UploadPresentationMaterialComponent>;
    modalSettings.initialState = {
      eventId: this.event.id,
    };
    const modal = this._modalService.show(UploadPresentationMaterialComponent, modalSettings).content;
    modal.modelSaved
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        this.refresh();
      });
  }

  onDeleteClick(eventResource: EventResourceDto): void {
    this.message.confirm(this.l('DeleteEventResourceConfirmationMessage'), undefined, (result => {
      if (result) {
        this.isLoading = true;
        this._uploadService.delete(eventResource.document, eventResource.id)
          .pipe(takeUntil(this.destroyed$))
          .subscribe(() => {
            this._eventResourcesService.delete(eventResource.id)
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
    request: PagedEventResourceRequestDto,
    pageNumber: number,
    finishedCallback: Function,
  ): void {
    if (this.event.id) {
      this.isLoading = true;
      request.sort = 'name';
      request.eventIdFilter = this.event.id;
      request.presentationMaterialOnlyFilter = true;
      request.handoutsOnlyFilter = false;

      this._eventResourcesService
        .getAll(
          request.eventIdFilter,
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
          this.eventResources = result.items;
          this.showPaging(result, pageNumber);
        });
    }
  }
}
