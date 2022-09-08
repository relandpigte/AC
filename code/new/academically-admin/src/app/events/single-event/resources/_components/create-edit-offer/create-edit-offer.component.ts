
import { Component, OnInit, Injector, Output, EventEmitter, Input } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { BsModalRef, ModalOptions, BsModalService } from 'ngx-bootstrap/modal';
import { SelectPollQuestionComponent } from '../select-poll-question/select-poll-question.component';
import { EventPollQuestionType, EventPollQuestionDto, CreateEventOfferDto, EventOffersServiceProxy, EventOfferDiscountTypes, EventOfferServiceTypes } from '@shared/service-proxies/service-proxies';
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


  currentQuestion: EventPollQuestionDto;
  isLoading = false;
  eventOfferServiceTypes= EventOfferServiceTypes;
  eventOfferDiscountTypes= EventOfferDiscountTypes;

  EventPollQuestionType = EventPollQuestionType;
  selectedCity3: string;

  selectedService: any;
  @Input() services: any = [
    {
      group: 'Courses',
      services: [
        { id: 1, type: 'Courses', title: 'Course 1' },
        { id: 2, type: 'Courses', title: 'Course 2' },
        { id: 3, type: 'Courses', title: 'Course 3' },
        { id: 4, type: 'Courses', title: 'Course 4' },
        { id: 5, type: 'Courses', title: 'Course 5' },
        { id: 6, type: 'Courses', title: 'Course 6' },
        { id: 7, type: 'Courses', title: 'Course 7' },
      ]
    },
    {
      group: 'Events',
      services: [
        { id: 8,  type: 'Events', title: 'Event 1' },
        { id: 9,  type: 'Events', title: 'Event 2' },
        { id: 10, type: 'Events', title: 'Event 3' },
        { id: 11, type: 'Events', title: 'Event 4' },
        { id: 12, type: 'Events', title: 'Event 5' },
        { id: 13, type: 'Events', title: 'Event 6' },
        { id: 14, type: 'Events', title: 'Event 7' },
      ]
    }
  ]

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
