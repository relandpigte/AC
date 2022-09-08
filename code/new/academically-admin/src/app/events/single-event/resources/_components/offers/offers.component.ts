import { MyServiceViewDto } from './../../../../../../shared/service-proxies/service-proxies';
import { ServiceGroupedDropdownData } from './../../_models/serviceGroupedDropdownData';
import { takeUntil, finalize } from 'rxjs/operators';
import { Component, Injector, OnInit } from "@angular/core";
import { EventService } from "@app/events/_services/event.service";
import { PagedAndSortedRequestDto, PagedListingComponentBase } from "@shared/paged-listing-component-base";
import { CoachingDto, CourseDto, EventDto, EventOfferDto, EventOffersServiceProxy, EventPollDto, WorkshopDto, VideoDto, ArticleDto, CoursesServiceProxy, CoachingsServiceProxy, WorkshopsServiceProxy, VideosServiceProxy, ArticlesServiceProxy, CourseStatus } from "@shared/service-proxies/service-proxies";
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
  events: EventDto[] = [];
  courses: CourseDto[] = [];
  coachings: CoachingDto[] = [];
  workshops: WorkshopDto[] = [];
  videos: VideoDto[] = [];
  articles: ArticleDto[] = [];
  allServices: MyServiceViewDto[] = [];

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
    this.loadAllServices();
  }

  onAddClick(): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<CreateEditOfferComponent>;
    modalSettings.class = 'modal-lg';
    modalSettings.initialState = {
      eventId: this.event.id,
      allMyServices: this.allServices,
    };
    const modal = this._modalService.show(CreateEditOfferComponent, modalSettings).content;
    modal.modelSaved
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        this.pageNumber = 1;
        this.refresh();
      });
  }

  onEditClick(offer: EventOfferDto): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<CreateEditOfferComponent>;
    modalSettings.class = 'modal-lg';
    modalSettings.initialState = {
      model: offer,
      allMyServices: this.allServices,
    };
    const modal = this._modalService.show(CreateEditOfferComponent, modalSettings).content;
    this.pipeDestroy(modal.modelSaved, () => {
      this.pageNumber = 1;
      this.refresh();
    });
  }

  onDeleteClick(offer: EventOfferDto): void {
    this.message.confirm(this.l('DeleteEventOfferConfirmationMessage'), undefined, (result => {
      if (result) {
        this.isLoading = true;
        this._eventOffersService.delete(offer.id)
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

  loadAllServices(): void {

    this._eventOffersService.getAllMyServices()
      .subscribe(result => {
        this.allServices = result;
      });
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
