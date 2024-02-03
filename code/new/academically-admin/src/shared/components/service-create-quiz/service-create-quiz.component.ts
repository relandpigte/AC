import { Component, ElementRef, EventEmitter, Injector, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { NgControl, NgForm } from '@angular/forms';
import { AppComponentBase } from '@shared/app-component-base';
import { ServiceCardUtils } from '@shared/helpers/service-card-utils';
import { CreateServiceQuizDto, CreateServiceQuizQuestionDto, CreateServiceQuizQuestionOptionDto, ServiceQuizQuestionType, ServiceQuizTrigger, ServiceQuizesServiceProxy, ServicesType } from '@shared/service-proxies/service-proxies';
import { DragulaService } from 'ng2-dragula';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';

export enum CreateQuizTabs {
    INTRODUCTION = 'introduction',
    QUESTIONS = 'questions'
}

export interface SelectOption {
    value: any;
    label: string;
}

 type CollectionTypes = CreateServiceQuizQuestionDto|CreateServiceQuizQuestionOptionDto;

export const ServiceQuizTriggerToLabel: { [key in ServiceQuizTrigger]?: string } = {
    [ServiceQuizTrigger.PurchaseOfService]: 'Service.Quiz.Trigger.PurchaseOfService',
    [ServiceQuizTrigger.StartOfService]: 'Service.Quiz.Trigger.StartOfService',
    [ServiceQuizTrigger.EndOfService]: 'Service.Quiz.Trigger.EndOfService',
    [ServiceQuizTrigger.CompletionOfService]: 'Service.Quiz.Trigger.CompletionOfService',
    [ServiceQuizTrigger.Manual]: 'Service.Quiz.Trigger.Manual',
};

export const ServiceQuizQuestionTypeToLabel: { [key in ServiceQuizQuestionType]?: string } = {
    [ServiceQuizQuestionType.MultipleChoice]: 'Service.Quiz.Question.Type.MultipleChoice',
    [ServiceQuizQuestionType.MultipleResponse]: 'Service.Quiz.Question.Type.MultipleResponse',
};


const QUESTIONS_CONTAINER = 'service-quiz-body-questions';
const OPTIONS_CONTAINER = 'service-quiz-body-questions-item-options';

const QUESTION_ITEM_CLASS = 'service-quiz-body-questions-item';
const OPTION_ITEM_CLASS = 'service-quiz-body-questions-item-options-item';

@Component({
    selector: 'app-service-create-quiz',
    templateUrl: './service-create-quiz.component.html',
    styleUrls: ['./service-create-quiz.component.less']
})
export class ServiceCreateQuizComponent extends AppComponentBase implements OnInit, OnDestroy {
    @ViewChild(NgForm) createQuizForm: NgForm;
    @ViewChild('durationModel') durationControl: NgControl;

    @Input() referenceId: string;
    @Input() serviceType: ServicesType;
    @Input() model = new CreateServiceQuizDto();

    @Output() modelSaved = new EventEmitter();

    dragulaGroup = 'quizes';

    durationOptions: SelectOption[] = [
        { value: 60, label: '1 minute' },
        { value: 720, label: '12 minutes' },
        { value: 1800, label: '30 minutes' },
        { value: 3600, label: '1 hour' },
    ];

    triggerOptions: SelectOption[] = [
        { value: ServiceQuizTrigger.PurchaseOfService, label: ServiceQuizTriggerToLabel[ServiceQuizTrigger.PurchaseOfService] },
        { value: ServiceQuizTrigger.StartOfService, label: ServiceQuizTriggerToLabel[ServiceQuizTrigger.StartOfService] },
        { value: ServiceQuizTrigger.EndOfService, label: ServiceQuizTriggerToLabel[ServiceQuizTrigger.EndOfService] },
        { value: ServiceQuizTrigger.CompletionOfService, label: ServiceQuizTriggerToLabel[ServiceQuizTrigger.CompletionOfService] },
        { value: ServiceQuizTrigger.Manual, label: ServiceQuizTriggerToLabel[ServiceQuizTrigger.Manual] },
    ];

    questionTypeOptions: SelectOption[] = [
        { value: ServiceQuizQuestionType.MultipleChoice, label: ServiceQuizQuestionTypeToLabel[ServiceQuizQuestionType.MultipleChoice] },
        { value: ServiceQuizQuestionType.MultipleResponse, label: ServiceQuizQuestionTypeToLabel[ServiceQuizQuestionType.MultipleResponse] },
    ];

    isLoading = false;

    activeTab: CreateQuizTabs = CreateQuizTabs.INTRODUCTION;

    CreateQuizTabs = CreateQuizTabs;
    ServiceQuizQuestionType = ServiceQuizQuestionType;
    ServiceQuizQuestionTypeToLabel = ServiceQuizQuestionTypeToLabel;

    textareaLineNumbers: { [id: string]: number } = {};

    constructor(
        injector: Injector,
        private _elRef: ElementRef,
        private _modal: BsModalRef,
        private _dragulaService: DragulaService,
        private _serviceQuizesService: ServiceQuizesServiceProxy,
    ) {
        super(injector);
        this._dragulaService.createGroup(this.dragulaGroup, {
            revertOnSpill: true,
            moves: (el: any) => el && el?.getAttribute('temporary') !== 'true' && !el?.classList.contains('no-drag'),
            accepts: (el, target, source, sibling) => {
                if (!el || !target || !sibling) return false;
                const isQuestion = el.classList.contains(QUESTION_ITEM_CLASS);
                if (isQuestion)
                    return target.classList.contains(QUESTIONS_CONTAINER)&& !sibling.classList.contains('no-next-drag');
                return target.classList.contains(OPTIONS_CONTAINER);
            }
        });

        this._dragulaService.dropModel(this.dragulaGroup).subscribe(args => {
        });
    }

    get isModelValid(): boolean { return this.createQuizForm?.valid; }
    get serviceTypeObject(): string { return ServiceCardUtils.getServiceTypeObject(this.serviceType); }

    async ngOnInit() {
        this.addTemporaryQuestion();
    }

    ngOnDestroy(): void {
        this._dragulaService.destroy(this.dragulaGroup);
    }

    onCloseClick(): void {
        this._modal.hide();
    }

    getTextareaLine(id: string) {
        if (!(id in this.textareaLineNumbers)) this.textareaLineNumbers[id] = 1;
        return this.textareaLineNumbers[id];
    }

    adjustTextareaLines(id: string) {
        const textarea = this._elRef.nativeElement.querySelector(`#${id}`) as HTMLTextAreaElement;
        if (textarea) {
            if (!(id in this.textareaLineNumbers)) {
                this.textareaLineNumbers[id] = 1;
            }
            setTimeout(() => {
                if (textarea.clientHeight < textarea.scrollHeight) {
                    this.textareaLineNumbers[id] += 1;
                }
            });
        }
    }

    onFormSubmit(): void {
        if (this.activeTab === CreateQuizTabs.INTRODUCTION) {
            this.activeTab = CreateQuizTabs.QUESTIONS;
        } else {
            this.isLoading = true;
            this.model.referenceId = this.referenceId;
            this.model.serviceType = this.serviceType;

            this.model.serviceQuizQuestions.forEach((q, idx) => {
                q.displayOrder = idx + 1;
                q.serviceQuizQuestionOptions.forEach((o, idx) => {
                    o.displayOrder = idx + 1;
                });
            });

            this._serviceQuizesService.create(this.model)
            .pipe(finalize(() => this.isLoading = false))
            .subscribe(res => {
                this.isLoading = false;
                this.modelSaved.emit();
                this._modal.hide();
            });
        }
    }

    onBlurText(value: CollectionTypes, key: string, parent?: CollectionTypes) {
        if (value[key]) {
            if (value.isTemporary) {
                value.isTemporary = false;
                if (parent instanceof CreateServiceQuizQuestionDto) {
                    this.addTemporaryOption(parent);
                }
            }
        } else {
            this.removeFromCollection(value, key);
        }
    }

    onKeyPressText(event) {
        if (event.keyCode === 13) {
            event.target.blur();
            event.preventDefault();
            event.stopPropagation();
        }
    }

    onKeyUpText(event, value: CollectionTypes, key: string) {
        if (event.keyCode === 27) {
            this.removeFromCollection(value, key);
        }
    }

    private removeFromCollection(value: CollectionTypes, key: string) {
        if (value instanceof CreateServiceQuizQuestionDto) {
            if (this.model.serviceQuizQuestions.length > 1) {
                this.model.serviceQuizQuestions = this.model.serviceQuizQuestions.filter(i => !i.isTemporary);
            }
        } else {
            this.model.serviceQuizQuestions.forEach(q => {
                if (q.id === value.serviceQuizQuestionId) {
                    q.serviceQuizQuestionOptions = q.serviceQuizQuestionOptions.filter(i => !i.isTemporary);
                }
            });
        }
    }

    isIntroductionFormValid(): boolean {
        if (!this.model.name) return false;
        if (!this.model.duration) return false;
        if (!this.model.trigger) return false;
        return true;
    }

    addTemporaryQuestion() {
        if (!this.model.serviceQuizQuestions) this.model.serviceQuizQuestions = [];
        this.model.serviceQuizQuestions.push(CreateServiceQuizQuestionDto.fromJS({
            id: this.uuidv4(),
            type: ServiceQuizQuestionType.MultipleChoice,
            isTemporary: true,
        }));
    }

    addTemporaryOption(question: CreateServiceQuizQuestionDto) {
        if (!question.serviceQuizQuestionOptions) question.serviceQuizQuestionOptions = [];
        question.serviceQuizQuestionOptions.push(CreateServiceQuizQuestionOptionDto.fromJS({
            id: this.uuidv4(),
            serviceQuizQuestionId: question.id,
            isTemporary: true,
        }));
    }

    deleteQuestion(question: CreateServiceQuizQuestionDto) {
        this.model.serviceQuizQuestions = this.model.serviceQuizQuestions.filter(q => q.id !== question.id);
    }

    deleteOption(option: CreateServiceQuizQuestionOptionDto, question: CreateServiceQuizQuestionDto) {
        question.serviceQuizQuestionOptions = question.serviceQuizQuestionOptions.filter(o => o.id !== option.id);
    }

    isQuestionMultipleResponses(question: CreateServiceQuizQuestionDto): boolean {
        return question.type === ServiceQuizQuestionType.MultipleResponse;
    }

    isQuestionAlreadyHasCorrectSelected(question: CreateServiceQuizQuestionDto): boolean {
        return question.serviceQuizQuestionOptions?.some(o => o.isCorrect);
    }

    toggleOptionCorrect(question: CreateServiceQuizQuestionDto, option: CreateServiceQuizQuestionOptionDto): void {
        if (question.type === ServiceQuizQuestionType.MultipleChoice) {
            question.serviceQuizQuestionOptions.forEach(o => o.isCorrect = false);
            option.isCorrect = true;
        } else {
            option.isCorrect = !option.isCorrect;
        }
    }

    onExplainAnswerToggle(question: CreateServiceQuizQuestionDto): void {
        if (!question.isExplainAnswer) question.explanation = '';
    }
}
