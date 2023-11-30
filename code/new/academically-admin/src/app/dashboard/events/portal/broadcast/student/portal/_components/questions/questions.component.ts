import { ChangeDetectorRef, Component, Injector, Input, OnDestroy, OnInit } from '@angular/core';
import { skip, takeUntil } from 'rxjs/operators';
import { AppComponentBase } from '@shared/app-component-base';
import { PortalService } from '../../_services/portal.service';
import { EventDto, HubEvent, QuestionDto, QuestionReactionDto, QuestionsServiceProxy, ReactionType } from '@shared/service-proxies/service-proxies';
import { CustomAction } from '@app/_shared/modules/questions/_model/questions.model';
import { QuestionService } from '@shared/services/question.service';
import { EventQuestionsStateService, questionType } from '@shared/services/event-questions-state.service';
import { AppStateConfig, AppStateServices } from '@shared/services/pub-sub.service';
import { StateUpdateType } from '@shared/services/state-base.service';
import { HubService } from '@app/_shared/services/hub.service';

@Component({
  selector: 'app-sidebar-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.less']
})
export class QuestionsComponent extends AppComponentBase implements OnInit, OnDestroy {
  @Input() referenceId: string;

  event: EventDto;
  attendeeIds: number[] = [];

  customReactionActions: CustomAction[] = [];
  customActions: CustomAction[] = [];

  questions: QuestionDto[] = [];
  totalQuestionsCount = 0;
  selectedQuestionType = 0;
  isLoadingQuestions = true;
  eventQuestionStateService: EventQuestionsStateService;

  liveQuestion: QuestionDto;

  constructor(
    injector: Injector,
    private _portalService: PortalService,
    private _questionService: QuestionService,
    private _hubService: HubService,
    private _cdr: ChangeDetectorRef,
    private _questionsService: QuestionsServiceProxy
  ) {
    super(injector);
    this.initQuestionsVar();
    this.initPortalService();
  }

  get userId(): number { return this.appSession.userId; }
  get hostId(): number { return this.event?.creatorUserId; }
  get isHost(): boolean { return this.event?.creatorUserId === this.userId; }
  get questionsStateId(): string { return 'questions'; }

  async ngOnInit(): Promise<void> {
    await this.initQuestionsAppStates();
    await this.questionsReactionsSubscriptions();
  }

  async ngOnDestroy() {
    await this.eventQuestionStateService?.stop();
  }

  handleTabClick(channelType: number): void {
    this._questionService.selectedQuestionType$.next(channelType);
  }

  handleCreateQuestion(question: QuestionDto): void {
    if (question.body?.length === 0) {
      return;
    }
    question.referenceId = this.referenceId;
    this._questionsService.create(question)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(x => x);
  }

  handleVote(question: QuestionDto): void {
    const reaction = new QuestionReactionDto();
    if (!question.questionReactions.some(r => r.creatorUserId === this.userId)) {
      reaction.questionId = question.id;
      reaction.referenceId = this.referenceId;
      reaction.type = ReactionType.Upvote;
      this._questionsService.createReaction(reaction)
        .pipe(takeUntil(this.destroyed$))
        .subscribe(x => x);
    } else {
      const index = question.questionReactions.findIndex(e => e.creatorUserId === this.userId);
      this._questionsService.deleteReaction(question.questionReactions[index].id)
        .pipe(takeUntil(this.destroyed$))
        .subscribe(x => x);
    }
  }

  handleAnswerLive(question: QuestionDto): void {
    this._portalService.liveQuestion = question;
  }

  private initQuestionsVar(): void {
    this._questionService.selectedQuestionType$
      .pipe(takeUntil(this.destroyed$))
      .pipe(skip(1))
      .subscribe(async selectedQuestionType => {
        this.selectedQuestionType = selectedQuestionType;
        let args: any[];
        switch (selectedQuestionType) {
          case 1: // Asked by student [current logged in student]
            args = [this.referenceId, undefined, undefined, this.userId];
            break;
          case 2: // Unanswered
            args = [this.referenceId, this.hostId, false];
            break;
          case 3: // Answered
            args = [this.referenceId, this.hostId, true];
            break;
          default: // Display all
            args = [this.referenceId];
            break;
        }
        await this.eventQuestionStateService.updateServiceParams({ type: questionType.all, args });
        this.questions = this.eventQuestionStateService.getAllQuestions();
        this.totalQuestionsCount = this.eventQuestionStateService.totalQuestionsCount;
      });
  }

  private async initQuestionsAppStates(): Promise<void> {
    const appStateConfig: AppStateConfig = {
      [this.questionsStateId]: {
        load: [this.referenceId],
        update: { referenceId: this.referenceId }
      }
    };
    const appStateServices: AppStateServices = {
      [this.questionsStateId]: {
        type: EventQuestionsStateService,
        args: [this._hubService, this._questionsService]
      }
    };
    await this.pubSubService.start(this, appStateConfig, appStateServices);
    this.eventQuestionStateService = this.pubSubService.getStateService<EventQuestionsStateService>(this.questionsStateId);
    this.eventQuestionStateService.loading$.pipe(takeUntil(this.destroyed$)).subscribe(loading => this.isLoadingQuestions = loading);
    this.eventQuestionStateService.questions$.pipe(takeUntil(this.destroyed$)).subscribe(event => {
      switch (event.type) {
        case StateUpdateType.Add:
          if (event.data.parentId !== null) {
            const index = this.questions.findIndex(q => q.id === event.data.parentId);
            this.questions[index].children.push(event.data);
            this.questions[index].replyCount += 1;
          } else {
            this.questions = [event.data].concat(this.questions);
          }
          this.totalQuestionsCount++;
          break;
        case StateUpdateType.Update:
          this.questions = this.questions.map(p => p.id === event.data?.id ? event.data : p);
          break;
        case StateUpdateType.Delete:
          this.questions = this.questions.filter(c => c.id !== event.data.id);
          this.totalQuestionsCount--;
          break;
      }
      this._cdr.detectChanges();
    });

    this.questions = this.eventQuestionStateService.getAllQuestions();
    this.totalQuestionsCount = this.eventQuestionStateService.totalQuestionsCount;
  }

  private async questionsReactionsSubscriptions(): Promise<void> {
    const hub = await this._hubService.getQuestionsReactionsHub({ 'referenceId': this.referenceId });
    hub.on(HubEvent[HubEvent.QuestionReactionCreated], (r: QuestionReactionDto) => this.updateReaction(r, ReactionType.Upvote));
    hub.on(HubEvent[HubEvent.QuestionReactionUpdated], (r: QuestionReactionDto) => this.updateReaction(r, ReactionType.Upvote));
    hub.on(HubEvent[HubEvent.QuestionReactionDeleted], (r: QuestionReactionDto) => this.updateReaction(r, ReactionType.Downvote));
  }

  private updateReaction(reaction: QuestionReactionDto, type: ReactionType): void {
    const index = this.questions.findIndex(q => q.id === reaction.questionId);
    switch (type) {
      case ReactionType.Upvote:
        this.questions[index]?.questionReactions?.push(reaction);
        break;
      case ReactionType.Downvote:
        const i = this.questions[index].questionReactions.findIndex(e => e.creatorUserId === this.userId);
        this.questions[index]?.questionReactions.splice(i, 1);
        break;
    }
  }

  private initPortalService(): void {
    this._portalService.event$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(event => {
        this.event = event;
        this.referenceId = event.id;
      });

    this._portalService.attendees$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(attendees => {
        this.attendeeIds = attendees.filter(a => a.user).map(a => a.user.id);
      });
  }
}
