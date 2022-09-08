import { takeUntil, finalize } from 'rxjs/operators';
import { Component, Injector, OnInit } from "@angular/core";
import { EventService } from "@app/events/_services/event.service";
import { PagedAndSortedRequestDto, PagedListingComponentBase } from "@shared/paged-listing-component-base";
import { EventDto, EventOfferDto, EventOffersServiceProxy, EventPollDto } from "@shared/service-proxies/service-proxies";
import { BsModalService, ModalOptions } from "ngx-bootstrap/modal";
import { CreateEditOfferComponent } from '../create-edit-offer/create-edit-offer.component';

class PagedEventOfferResultRequestDto extends PagedAndSortedRequestDto {
  eventIdFilter: string;
}

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.scss'],
  providers: [ EventOffersServiceProxy ]
})
export class OffersComponent extends PagedListingComponentBase<EventOfferDto> implements OnInit {
  event = new EventDto();
  eventOffers: EventOfferDto[] = [];
  isLoading = false;

  constructor(
    injector: Injector,
    private _modalService: BsModalService,
    private _eventService: EventService,
    private _eventOffersService: EventOffersServiceProxy,
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
    const modalSettings = this.defaultModalSettings as ModalOptions<CreateEditOfferComponent>;
    modalSettings.class = 'modal-lg';
    modalSettings.initialState = {
      eventId: this.event.id,
    };
    const modal = this._modalService.show(CreateEditOfferComponent, modalSettings).content;
    modal.modelSaved
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        this.pageNumber = 1;
        this.refresh();
      });
  }

  onEditClick(poll: EventPollDto): void {
    // const modalSettings = this.defaultModalSettings as ModalOptions<CreateEditPollComponent>;
    // modalSettings.class = 'modal-lg';
    // modalSettings.initialState = {
    //   model: poll,
    // };
    // const modal = this._modalService.show(CreateEditPollComponent, modalSettings).content;
    // this.pipeDestroy(modal.modelSaved, () => {
    //   this.pageNumber = 1;
    //   this.refresh();
    // });
  }

  onDeleteClick(eventPoll: EventPollDto): void {
    // this.message.confirm(this.l('DeleteEventPollConfirmationMessage'), undefined, (result => {
    //   if (result) {
    //     this.isLoading = true;
    //     this._eventOffersService.delete(eventPoll.id)
    //       .pipe(
    //         takeUntil(this.destroyed$),
    //         finalize(() => {
    //           this.isLoading = false;
    //         })
    //       )
    //       .subscribe(() => {
    //         this.notify.success(this.l('SuccessfullyDeleted'));
    //         this.pageNumber = 1;
    //         this.refresh();
    //       });
    //   }
    // }));
  }

  protected list(
    request: PagedEventOfferResultRequestDto,
    pageNumber: number,
    finishedCallback: Function,
  ): void {
    if (this.event.id) {
      this.isLoading = true;
      request.sort = 'serviceTitle';
      request.eventIdFilter = this.event.id;

      this._eventOffersService
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
          this.eventOffers = result.items;
          this.showPaging(result, pageNumber);
        });
    }
  }
}
