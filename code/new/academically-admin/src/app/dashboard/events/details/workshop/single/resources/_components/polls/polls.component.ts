import { Component, Injector, OnInit } from '@angular/core';
import { EventService } from '@app/dashboard/events/_services/event.service';
import { PagedAndSortedRequestDto, PagedListingComponentBase } from '@shared/paged-listing-component-base';
import { EventDto, EventPollDto, EventPollsServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { finalize, takeUntil } from 'rxjs/operators';
import { CreateEditPollComponent } from '../create-edit-poll/create-edit-poll.component';
import { ModalDialogOptions, ModalDialogService } from '@shared/services/modal-dialog.service';

class PagedWorkshopPollRequestDto extends PagedAndSortedRequestDto {
  workshopIdFilter: string;
}

@Component({
  selector: 'app-polls',
  templateUrl: './polls.component.html',
  styleUrls: ['./polls.component.less']
})
export class PollsComponent extends PagedListingComponentBase<EventPollDto> implements OnInit {
  workshop = new EventDto();
  workshopPolls: EventPollDto[] = [];
  isLoading = false;

  constructor(
    injector: Injector,
    private _modalService: BsModalService,
    private _workshopService: EventService,
    private _workshopPollsService: EventPollsServiceProxy,
    private _modalDialogService: ModalDialogService
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
    const modalSettings = this.defaultModalSettings as ModalOptions<CreateEditPollComponent>;
    modalSettings.class = 'modal-lg';
    modalSettings.initialState = {
      workshopId: this.workshop.id,
    };
    const modal = this._modalService.show(CreateEditPollComponent, modalSettings).content;
    modal.modelSaved
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        this.pageNumber = 1;
        this.refresh();
      });
  }

  onDeleteClick(workshopPoll: EventPollDto): void {
    const options: ModalDialogOptions = {
      title: this.l('AreYouSure'),
      text: this.l('DeleteWorkshopPollConfirmationMessage'),
      confirmCb: (): void => {
        this.isLoading = true;
        this._workshopPollsService.delete(workshopPoll.id)
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
      }
    };
    this._modalDialogService.showConfirmDialog(options);
  }

  protected list(
    request: PagedWorkshopPollRequestDto,
    pageNumber: number,
    finishedCallback: Function,
  ): void {
    if (this.workshop.id) {
      this.isLoading = true;
      request.sort = 'name';
      request.workshopIdFilter = this.workshop.id;

      this._workshopPollsService
        .getAll(
          request.workshopIdFilter,
          undefined,
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
          this.workshopPolls = result.items;
          this.showPaging(result, pageNumber);
        });
    }
  }
}
