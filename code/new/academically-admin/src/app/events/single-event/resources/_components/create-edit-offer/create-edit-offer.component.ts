
import { Component, OnInit, Injector, Output, EventEmitter, Input } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { BsModalRef, ModalOptions, BsModalService } from 'ngx-bootstrap/modal';
import { EventPollQuestionType, EventPollQuestionDto, CreateEventOfferDto, EventOffersServiceProxy, EventOfferDiscountTypes, EventOfferServiceTypes, MyServiceViewDto, MyServiceItemViewDto } from '@shared/service-proxies/service-proxies';
import { takeUntil, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-create-edit-offer',
  templateUrl: './create-edit-offer.component.html',
  styleUrls: ['./create-edit-offer.component.scss'],
  providers: [ EventOffersServiceProxy ]
})
export class CreateEditOfferComponent extends AppComponentBase implements OnInit {
  @Input() eventId: string;
  @Input() model = new CreateEventOfferDto();
  @Output() modelSaved = new EventEmitter();

  @Input() allMyServices: MyServiceViewDto[] = [];


  currentQuestion: EventPollQuestionDto;
  isLoading = false;
  eventOfferServiceTypes= EventOfferServiceTypes;
  eventOfferDiscountTypes= EventOfferDiscountTypes;

  EventPollQuestionType = EventPollQuestionType;
  selectedCity3: string;

  selectedService: MyServiceItemViewDto;


  constructor(
    injector: Injector,
    private _modal: BsModalRef,
    private _modalService: BsModalService,
    private _eventOffersService: EventOffersServiceProxy,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    if (!this.model.id) {
      this.model.eventId = this.eventId;
    }
  }

  serviceSelect(service: any): void {
    this.model.serviceTitle = service.title;
    this.model.serviceId = service.id;
    this.model.serviceType = service.Type;
  }

  onCloseClick(): void {
    this._modal.hide();
  }

  onFormSubmit(): void {
    this.isLoading = true;
    (!this.model.id
      ? this._eventOffersService.create(this.model)
      : this._eventOffersService.update(this.model))
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(response => {
        this.notify.success(this.l('SavedSuccessfully'));
        this.modelSaved.emit();
        this._modal.hide();
      });
  }


}
