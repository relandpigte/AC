import { Component, OnInit, Injector } from '@angular/core';
import { CreateEditPollComponent } from '../create-edit-poll/create-edit-poll.component';
import { ModalOptions, BsModalService } from 'ngx-bootstrap/modal';
import { EventService } from '@app/dashboard/events/_services/event.service';
import { EventDto, EventPollDto, EventPollsServiceProxy } from '@shared/service-proxies/service-proxies';
import { takeUntil, finalize } from 'rxjs/operators';
import { PagedListingComponentBase, PagedAndSortedRequestDto } from '@shared/paged-listing-component-base';

class PagedEventPollRequestDto extends PagedAndSortedRequestDto {
  eventIdFilter: string;
}

@Component({
  selector: 'app-polls',
  templateUrl: './polls.component.html',
  styleUrls: ['./polls.component.less']
})
export class PollsComponent extends PagedListingComponentBase<EventPollDto> implements OnInit {
  event = new EventDto();
  eventPolls: EventPollDto[] = [];
  isLoading = false;

  constructor(
    injector: Injector,
    private _modalService: BsModalService,
    private _eventService: EventService,
    private _eventPollsService: EventPollsServiceProxy,
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

  ngOnInit(): void {
  }

  onAddClick(): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<CreateEditPollComponent>;
    modalSettings.class = 'modal-lg';
    modalSettings.initialState = {
      eventId: this.event.id,
    };
    const modal = this._modalService.show(CreateEditPollComponent, modalSettings).content;
    modal.modelSaved
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        this.pageNumber = 1;
        this.refresh();
      });
  }

  onEditClick(poll: EventPollDto): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<CreateEditPollComponent>;
    modalSettings.class = 'modal-lg';
    modalSettings.initialState = {
      model: poll,
    };
    const modal = this._modalService.show(CreateEditPollComponent, modalSettings).content;
    this.pipeDestroy(modal.modelSaved, () => {
      this.pageNumber = 1;
      this.refresh();
    });
  }

  onDeleteClick(eventPoll: EventPollDto): void {
    this.message.confirm(this.l('DeleteEventPollConfirmationMessage'), undefined, (result => {
      if (result) {
        this.isLoading = true;
        this._eventPollsService.delete(eventPoll.id)
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
    }));
  }

  protected list(
    request: PagedEventPollRequestDto,
    pageNumber: number,
    finishedCallback: Function,
  ): void {
    if (this.event.id) {
      this.isLoading = true;
      request.sort = 'name';
      request.eventIdFilter = this.event.id;

      this._eventPollsService
        .getAll(
          request.eventIdFilter,
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
          this.eventPolls = result.items;
          this.showPaging(result, pageNumber);
        });
    }
  }
}
