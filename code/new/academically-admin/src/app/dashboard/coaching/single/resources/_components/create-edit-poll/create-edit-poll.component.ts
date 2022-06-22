import { Component, OnInit, Injector, Output, EventEmitter, Input } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { BsModalRef, ModalOptions, BsModalService } from 'ngx-bootstrap/modal';
import { SelectPollQuestionComponent } from '../select-poll-question/select-poll-question.component';
import { CoachingPollQuestionType, CoachingPollQuestionDto, CoachingPollQuestionOptionDto, CoachingPollsServiceProxy, CreateCoachingPollDto } from '@shared/service-proxies/service-proxies';
import { takeUntil, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-create-edit-poll',
  templateUrl: './create-edit-poll.component.html',
  styleUrls: ['./create-edit-poll.component.less']
})
export class CreateEditPollComponent extends AppComponentBase implements OnInit {
  @Input() coachingId: string;
  @Output() modelSaved = new EventEmitter();

  model = new CreateCoachingPollDto();
  currentQuestion: CoachingPollQuestionDto;
  isLoading = false;

  CoachingPollQuestionType = CoachingPollQuestionType;

  constructor(
    injector: Injector,
    private _modal: BsModalRef,
    private _modalService: BsModalService,
    private _coachingPollsService: CoachingPollsServiceProxy,
  ) {
    super(injector);
    this.model.coachingPollQuestions = [];
  }

  ngOnInit(): void {
    this.model.coachingId = this.coachingId;
  }

  onCloseClick(): void {
    this._modal.hide();
  }

  onFormSubmit(): void {
    this.isLoading = true;
    this._coachingPollsService.create(this.model)
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
        const newQuestion = new CoachingPollQuestionDto();
        newQuestion.type = response;
        newQuestion.coachingPollQuestionOptions = [];
        this.model.coachingPollQuestions.push(newQuestion);
        this.currentQuestion = newQuestion;
      });
  }

  onEditQuestionClick(question: CoachingPollQuestionDto): void {
    this.currentQuestion = question;
    if (!this.currentQuestion.coachingPollQuestionOptions) {
      this.currentQuestion.coachingPollQuestionOptions = [];
    }
  }

  onAddOptionClick(): void {
    const newOption = new CoachingPollQuestionOptionDto();
    this.currentQuestion.coachingPollQuestionOptions.push(newOption);
  }
}
