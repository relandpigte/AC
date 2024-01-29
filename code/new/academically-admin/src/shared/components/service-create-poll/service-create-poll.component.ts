import { Component, EventEmitter, Injector, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { NgControl, NgForm } from '@angular/forms';
import { AppComponentBase } from '@shared/app-component-base';
import { ServiceCardUtils } from '@shared/helpers/service-card-utils';
import { CreateServicePollDto, CreateServicePollQuestionDto, CreateServicePollQuestionOptionDto, ServicePollQuestionType, ServicePollTrigger, ServicePollsServiceProxy, ServicesType } from '@shared/service-proxies/service-proxies';
import { DragulaService } from 'ng2-dragula';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';

export enum CreatePollTabs {
    INTRODUCTION = 'introduction',
    QUESTIONS = 'questions'
}

export interface SelectOption {
    value: any;
    label: string;
}

 type CollectionTypes = CreateServicePollQuestionDto|CreateServicePollQuestionOptionDto;

export const ServicePollTriggerToLabel: { [key in ServicePollTrigger]?: string } = {
    [ServicePollTrigger.PurchaseOfService]: 'Service.Poll.Trigger.PurchaseOfService',
    [ServicePollTrigger.StartOfService]: 'Service.Poll.Trigger.StartOfService',
    [ServicePollTrigger.EndOfService]: 'Service.Poll.Trigger.EndOfService',
    [ServicePollTrigger.CompletionOfService]: 'Service.Poll.Trigger.CompletionOfService',
    [ServicePollTrigger.Manual]: 'Service.Poll.Trigger.Manual',
};

export const ServicePollQuestionTypeToLabel: { [key in ServicePollQuestionType]?: string } = {
    [ServicePollQuestionType.MultipleChoice]: 'Service.Poll.Question.Type.MultipleChoice',
    [ServicePollQuestionType.MultipleResponse]: 'Service.Poll.Question.Type.MultipleResponse',
};


const QUESTIONS_CONTAINER = 'service-poll-body-questions';
const OPTIONS_CONTAINER = 'service-poll-body-questions-item-options';

const QUESTION_ITEM_CLASS = 'service-poll-body-questions-item';
const OPTION_ITEM_CLASS = 'service-poll-body-questions-item-options-item';

@Component({
    selector: 'app-service-create-poll',
    templateUrl: './service-create-poll.component.html',
    styleUrls: ['./service-create-poll.component.less']
})
export class ServiceCreatePollComponent extends AppComponentBase implements OnInit, OnDestroy {
    @ViewChild(NgForm) createPollForm: NgForm;
    @ViewChild('durationModel') durationControl: NgControl;

    @Input() referenceId: string;
    @Input() serviceType: ServicesType;
    @Input() model = new CreateServicePollDto();

    @Output() modelSaved = new EventEmitter();

    dragulaGroup = 'polls';

    durationOptions: SelectOption[] = [
        { value: 60, label: '1 minute' },
        { value: 720, label: '12 minutes' },
        { value: 1800, label: '30 minutes' },
        { value: 3600, label: '1 hour' },
    ];

    triggerOptions: SelectOption[] = [
        { value: ServicePollTrigger.PurchaseOfService, label: ServicePollTriggerToLabel[ServicePollTrigger.PurchaseOfService] },
        { value: ServicePollTrigger.StartOfService, label: ServicePollTriggerToLabel[ServicePollTrigger.StartOfService] },
        { value: ServicePollTrigger.EndOfService, label: ServicePollTriggerToLabel[ServicePollTrigger.EndOfService] },
        { value: ServicePollTrigger.CompletionOfService, label: ServicePollTriggerToLabel[ServicePollTrigger.CompletionOfService] },
        { value: ServicePollTrigger.Manual, label: ServicePollTriggerToLabel[ServicePollTrigger.Manual] },
    ];

    questionTypeOptions: SelectOption[] = [
        { value: ServicePollQuestionType.MultipleChoice, label: ServicePollQuestionTypeToLabel[ServicePollQuestionType.MultipleChoice] },
        { value: ServicePollQuestionType.MultipleResponse, label: ServicePollQuestionTypeToLabel[ServicePollQuestionType.MultipleResponse] },
    ];

    isLoading = false;

    activeTab: CreatePollTabs = CreatePollTabs.INTRODUCTION;

    CreatePollTabs = CreatePollTabs;
    ServicePollQuestionType = ServicePollQuestionType;
    ServicePollQuestionTypeToLabel = ServicePollQuestionTypeToLabel;

    constructor(
        injector: Injector,
        private _modal: BsModalRef,
        private _dragulaService: DragulaService,
        private _servicePollsService: ServicePollsServiceProxy,
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

    get isModelValid(): boolean { return this.createPollForm?.valid; }
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

    onFormSubmit(): void {
        if (this.activeTab === CreatePollTabs.INTRODUCTION) {
            this.activeTab = CreatePollTabs.QUESTIONS;
        } else {
            this.isLoading = true;
            this.model.referenceId = this.referenceId;
            this.model.serviceType = this.serviceType;

            this.model.servicePollQuestions.forEach((q, idx) => {
                q.displayOrder = idx + 1;
                q.servicePollQuestionOptions.forEach((o, idx) => {
                    o.displayOrder = idx + 1;
                });
            });

            this._servicePollsService.create(this.model)
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
                if (parent instanceof CreateServicePollQuestionDto) {
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
        if (value instanceof CreateServicePollQuestionDto) {
            if (this.model.servicePollQuestions.length > 1) {
                this.model.servicePollQuestions = this.model.servicePollQuestions.filter(i => !i.isTemporary);
            }
        } else {
            this.model.servicePollQuestions.forEach(q => {
                if (q.id === value.servicePollQuestionId) {
                    q.servicePollQuestionOptions = q.servicePollQuestionOptions.filter(i => !i.isTemporary);
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
        if (!this.model.servicePollQuestions) this.model.servicePollQuestions = [];
        this.model.servicePollQuestions.push(CreateServicePollQuestionDto.fromJS({
            id: this.uuidv4(),
            type: ServicePollQuestionType.MultipleChoice,
            isTemporary: true,
        }));
    }

    addTemporaryOption(question: CreateServicePollQuestionDto) {
        if (!question.servicePollQuestionOptions) question.servicePollQuestionOptions = [];
        question.servicePollQuestionOptions.push(CreateServicePollQuestionOptionDto.fromJS({
            id: this.uuidv4(),
            servicePollQuestionId: question.id,
            isTemporary: true,
        }));
    }

    deleteQuestion(question: CreateServicePollQuestionDto) {
        this.model.servicePollQuestions = this.model.servicePollQuestions.filter(q => q.id !== question.id);
    }

    deleteOption(option: CreateServicePollQuestionOptionDto, question: CreateServicePollQuestionDto) {
        question.servicePollQuestionOptions = question.servicePollQuestionOptions.filter(o => o.id !== option.id);
    }
}
