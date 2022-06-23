import { Component, OnInit, Injector, Output, EventEmitter, Input } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { BsModalRef, ModalOptions, BsModalService } from 'ngx-bootstrap/modal';
import { SelectPollQuestionComponent } from '../select-poll-question/select-poll-question.component';
import { WorkshopPollQuestionType, WorkshopPollQuestionDto, WorkshopPollQuestionOptionDto, WorkshopPollsServiceProxy, CreateWorkshopPollDto } from '@shared/service-proxies/service-proxies';
import { takeUntil, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-create-edit-poll',
  templateUrl: './create-edit-poll.component.html',
  styleUrls: ['./create-edit-poll.component.less']
})
export class CreateEditPollComponent extends AppComponentBase implements OnInit {
  @Input() workshopId: string;
  @Output() modelSaved = new EventEmitter();

  model = new CreateWorkshopPollDto();
  currentQuestion: WorkshopPollQuestionDto;
  isLoading = false;

  WorkshopPollQuestionType = WorkshopPollQuestionType;

  constructor(
    injector: Injector,
    private _modal: BsModalRef,
    private _modalService: BsModalService,
    private _workshopPollsService: WorkshopPollsServiceProxy,
  ) {
    super(injector);
    this.model.workshopPollQuestions = [];
  }

  ngOnInit(): void {
    this.model.workshopId = this.workshopId;
  }

  onCloseClick(): void {
    this._modal.hide();
  }

  onFormSubmit(): void {
    this.isLoading = true;
    this._workshopPollsService.create(this.model)
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
        const newQuestion = new WorkshopPollQuestionDto();
        newQuestion.type = response;
        newQuestion.workshopPollQuestionOptions = [];
        this.model.workshopPollQuestions.push(newQuestion);
        this.currentQuestion = newQuestion;
      });
  }

  onEditQuestionClick(question: WorkshopPollQuestionDto): void {
    this.currentQuestion = question;
    if (!this.currentQuestion.workshopPollQuestionOptions) {
      this.currentQuestion.workshopPollQuestionOptions = [];
    }
  }

  onAddOptionClick(): void {
    const newOption = new WorkshopPollQuestionOptionDto();
    this.currentQuestion.workshopPollQuestionOptions.push(newOption);
  }
}
