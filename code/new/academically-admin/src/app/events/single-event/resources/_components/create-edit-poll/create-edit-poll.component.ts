import { Component, OnInit, Injector, Output, EventEmitter, Input } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { BsModalRef, ModalOptions, BsModalService } from 'ngx-bootstrap/modal';
import { SelectPollQuestionComponent } from '../select-poll-question/select-poll-question.component';
import { EventPollQuestionType, EventPollQuestionDto, EventPollQuestionOptionDto, EventPollsServiceProxy, CreateEventPollDto } from '@shared/service-proxies/service-proxies';
import { takeUntil, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-create-edit-poll',
  templateUrl: './create-edit-poll.component.html',
  styleUrls: ['./create-edit-poll.component.less']
})
export class CreateEditPollComponent extends AppComponentBase implements OnInit {
  @Input() eventId: string;
  @Output() modelSaved = new EventEmitter();

  model = new CreateEventPollDto();
  currentQuestion: EventPollQuestionDto;
  isLoading = false;

  EventPollQuestionType = EventPollQuestionType;

  constructor(
    injector: Injector,
    private _modal: BsModalRef,
    private _modalService: BsModalService,
    private _eventPollsService: EventPollsServiceProxy,
  ) {
    super(injector);
    this.model.eventPollQuestions = [];
  }

  ngOnInit(): void {
    this.model.eventId = this.eventId;
  }

  onCloseClick(): void {
    this._modal.hide();
  }

  onFormSubmit(): void {
    this.isLoading = true;
    this._eventPollsService.create(this.model)
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

  onAddQuestionClick(): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<SelectPollQuestionComponent>;
    const modal = this._modalService.show(SelectPollQuestionComponent, modalSettings).content;
    modal.typeSelected
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        const newQuestion = new EventPollQuestionDto();
        newQuestion.type = response;
        newQuestion.eventPollQuestionOptions = [];
        this.model.eventPollQuestions.push(newQuestion);
        this.currentQuestion = newQuestion;
      });
  }

  onEditQuestionClick(question: EventPollQuestionDto): void {
    this.currentQuestion = question;
    if (!this.currentQuestion.eventPollQuestionOptions) {
      this.currentQuestion.eventPollQuestionOptions = [];
    }
  }

  onAddOptionClick(): void {
    const newOption = new EventPollQuestionOptionDto();
    this.currentQuestion.eventPollQuestionOptions.push(newOption);
  }
}
