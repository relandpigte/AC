import { Injectable } from '@angular/core';
import { HubConnection } from '@aspnet/signalr';
import { StateServiceBase, StateUpdate } from './state-base.service';
import { HubEvent, QuestionDto, QuestionsServiceProxy } from '../service-proxies/service-proxies';
import { BehaviorSubject, Subject } from '@node_modules/rxjs';
import { HubService } from '@app/_shared/services/hub.service';
import { Utils } from '@shared/helpers/utils';

export enum questionType {
  all = 'all'
}

@Injectable({
  providedIn: 'root'
})
export class EventQuestionsStateService extends StateServiceBase {
  questions: Map<string, QuestionDto> = new Map();
  totalQuestionsCount: number;

  questions$: Subject<StateUpdate<QuestionDto>> = new Subject();
  loading$: BehaviorSubject<boolean> = new BehaviorSubject(true);

  hub: HubConnection;
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
    if (this.hub) {
      this.hub.off(HubEvent[HubEvent.QuestionCreated], this.handleUpsertQuestion);
      this.hub.off(HubEvent[HubEvent.QuestionUpdated], this.handleUpsertQuestion);
      this.hub.off(HubEvent[HubEvent.QuestionDeleted], this.handleDeleteQuestion);
    }
  }

  protected async setupSubscriptions(component: any, userId: number): Promise<any> {
    try {
      this.hub = await this._hubService.getQuestionsHub(...this.updateArgs);
      this.hub.on(HubEvent[HubEvent.QuestionCreated], this.handleUpsertQuestion);
      this.hub.on(HubEvent[HubEvent.QuestionUpdated], this.handleUpsertQuestion);
      this.hub.on(HubEvent[HubEvent.QuestionDeleted], this.handleDeleteQuestion);
    } catch (err) {
      console.error(err);
    }
  }
}
