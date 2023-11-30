import { Injectable } from '@angular/core';
import { HubService } from '@app/_shared/services/hub.service';
import { BehaviorSubject, Subject } from '@node_modules/rxjs';
import { Utils } from '@shared/helpers/utils';
import { HubEvent, QuestionDto, QuestionsServiceProxy } from '../service-proxies/service-proxies';
import { StateServiceBase, StateUpdate } from './state-base.service';

export enum questionType {
  all = 'all'
}

const EVENT_QUESTIONS_HUB_NAME = 'eventQuestionsHub';

@Injectable({
  providedIn: 'root'
})
export class EventQuestionsStateService extends StateServiceBase {
  questions: Map<string, QuestionDto> = new Map();
  totalQuestionsCount: number;

  questions$: Subject<StateUpdate<QuestionDto>> = new Subject();
  loading$: BehaviorSubject<boolean> = new BehaviorSubject(true);

  type: questionType = questionType.all;
  fns = { [questionType.all]: 'getAll' };

  constructor(
    private _hubService: HubService,
    private _questionsService: QuestionsServiceProxy
  ) {
    super();
  }

  getAllQuestions = (): QuestionDto[]  => Array.from(this.questions.values());

  handleUpsertQuestion = async (question: QuestionDto): Promise<void> => {
    this.loading$.next(true);
    this.updateFromMap(this.questions, Utils.toObjectMap([question], (c) => c.id, (p) => p), this.questions$);
    this.loading$.next(false);
  }

  handleDeleteQuestion = async (question: QuestionDto): Promise<void> => {
    this.loading$.next(true);
    this.updateFromMap(this.questions, { [question.id]: null }, this.questions$);
    this.loading$.next(false);
  }

  async updateServiceParams(params: { type: questionType | undefined, args: any[] | undefined }): Promise<void> {
    this.loading$.next(true);
    this.type = params.type;
    this.actionArgs['load'] = params.args;
    try {
      const questions = await this._questionsService[this.fns[this.type ?? questionType.all]](...this.loadArgs).toPromise();
      this.questions = Utils.toMap(questions);
      this.totalQuestionsCount = questions.length;
    } catch (err) {
      console.error(err);
    }
    this.loading$.next(false);
  }

  async loadData(component: any, userId: number): Promise<void> {
    this.loading$.next(true);
    try {
      const questions = await this._questionsService[this.fns[this.type ?? questionType.all]](...this.loadArgs).toPromise();
      this.questions = Utils.toMap(questions);
      this.totalQuestionsCount = questions.length;
    } catch (err) {
      console.error(err);
    }
    this.loading$.next(false);
  }

  async stop(): Promise<void> {
    await super.stop();
    if (this.getHub(EVENT_QUESTIONS_HUB_NAME)) {
      this.getHub(EVENT_QUESTIONS_HUB_NAME).off(HubEvent[HubEvent.QuestionCreated], this.handleUpsertQuestion);
      this.getHub(EVENT_QUESTIONS_HUB_NAME).off(HubEvent[HubEvent.QuestionUpdated], this.handleUpsertQuestion);
      this.getHub(EVENT_QUESTIONS_HUB_NAME).off(HubEvent[HubEvent.QuestionDeleted], this.handleDeleteQuestion);
      this.stopHubConnection(EVENT_QUESTIONS_HUB_NAME);
    }
  }

  protected async setupSubscriptions(component: any, userId: number): Promise<any> {
    try {
      this.addHub(EVENT_QUESTIONS_HUB_NAME, await this._hubService.getQuestionsHub(...this.updateArgs));
      this.getHub(EVENT_QUESTIONS_HUB_NAME).on(HubEvent[HubEvent.QuestionCreated], this.handleUpsertQuestion);
      this.getHub(EVENT_QUESTIONS_HUB_NAME).on(HubEvent[HubEvent.QuestionUpdated], this.handleUpsertQuestion);
      this.getHub(EVENT_QUESTIONS_HUB_NAME).on(HubEvent[HubEvent.QuestionDeleted], this.handleDeleteQuestion);
      this.startHubConnection(EVENT_QUESTIONS_HUB_NAME);
    } catch (err) {
      console.error(err);
    }
  }
}
