import { AfterViewInit, Component, Injector, Input, OnInit } from '@angular/core';
import { HubService } from '@app/_shared/services/hub.service';
import { HubConnection } from '@aspnet/signalr';
import { AppComponentBase } from '@shared/app-component-base';
import { QuestionDto, QuestionReactionDto, QuestionsServiceProxy, ReactionType } from '@shared/service-proxies/service-proxies';
import * as _ from 'lodash';
import { finalize, takeUntil } from 'rxjs/operators';
import { CustomAction, QuestionAction, QuestionSignalData } from './_model/questions.model';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.less']
})
export class QuestionsComponent extends AppComponentBase implements OnInit, AfterViewInit {
  @Input() isSidebar = true;
  @Input() referenceId: string;
  @Input() answered: boolean;
  @Input() creatorId: number;
  @Input() hostId: number;
  @Input() attendeeIds: number[] = [];
  @Input() showHostBadge: boolean = true;
  @Input() customReactionActions: CustomAction[] = [];
  @Input() customActions: CustomAction[] = [];

  questions: QuestionDto[];
  isLoading = false;
  isQuestionsLoading = false;
  newQuestion = new QuestionDto();
  newReply: QuestionDto[] = [];
  isReplying: boolean[] = [];
  loadedReplyCount: number[] = [];

  questionsHub: HubConnection;
  hubConnected: boolean;

  private _maxRepliesToLoad = 3;

  constructor(
    injector: Injector,
    private _hubService: HubService,
    private _questionsService: QuestionsServiceProxy,
  ) {
    super(injector);
  }

  get userId(): number { return this.appSession.userId; }

  async ngOnInit(): Promise<void> {
    await this.initHub();
  }

  ngAfterViewInit(): void {
    this.getQuestions();
  }

  onFormSubmit(): void {
    this.createQuestion();
  }

  onReplyFormSubmit(parent: QuestionDto, replyIndex: number): void {
    this.createReply(parent, replyIndex);
  }

  onBodyKeydown(e: KeyboardEvent): void {
    if (e.key === 'Enter') {
      e.preventDefault();
      this.createQuestion();
    }
  }

  onReplyBodyKeydown(e: KeyboardEvent, parent: QuestionDto, replyIndex: number): void {
    if (e.key === 'Enter') {
      e.preventDefault();
      this.createReply(parent, replyIndex);
    }
  }

  onLoadMoreRepliesClick(parent: QuestionDto): void {
    this.getReplies(parent);
  }

  isUserUpvoted(question: QuestionDto): boolean {
    return question.questionReactions.some(q => q.creatorUserId === this.userId);
  }

  onLikeClick(question: QuestionDto): void {
    const reaction = new QuestionReactionDto();
    reaction.questionId = question.id;
    reaction.type = ReactionType.Upvote;
    this._questionsService.createReaction(reaction)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(async response => {
        question.questionReactions.push(response);
        await this.sendQuestionSignal(new QuestionSignalData(QuestionAction.Upvoted, question));
      });
  }

  onUnlikeClick(question: QuestionDto): void {
    const index = question.questionReactions.findIndex(e => e.creatorUserId === this.appSession.userId);
    if (index >= 0) {
      this._questionsService.deleteReaction(question.questionReactions[index].id)
        .pipe(takeUntil(this.destroyed$))
        .subscribe(async (): Promise<void> => {
          question.questionReactions.splice(index, 1);
          await this.sendQuestionSignal(new QuestionSignalData(QuestionAction.Downvoted, question));
        });
    }
  }

  checkIfReacted(question: QuestionDto): boolean {
    return question.questionReactions.filter(e => e.creatorUserId === this.appSession.userId).length > 0;
  }

  private async initHub(): Promise<void> {
    this.questionsHub = await this._hubService.getQuestionsHub(() => {
      this.hubConnected = true;
      this.questionsHub.on('receiveSignal', async (strData: string) => {
        const data = new QuestionSignalData();
        Object.assign(data, JSON.parse(strData));

        switch (data.action) {
          case QuestionAction.Created:
            const isAsked = _.isNil(this.creatorId) || this.creatorId === data.getDataObject().creatorUser?.id;
            if (!this.answered && isAsked) {
              this.questions.unshift(data.getDataObject());
              this.newReply[this.questions.length-1] = new QuestionDto();
            }
            break;

          case QuestionAction.Replied:
            this.addQuestionToParent(this.questions, data.getDataObject());
            break;

          case QuestionAction.Upvoted:
            this.forceUpdateQuestion(this.questions, data.getDataObject());
            break;

          case QuestionAction.Downvoted:
            this.forceUpdateQuestion(this.questions, data.getDataObject());
            break;
        }

      });
    });
  }

  private addQuestionToParent(list: QuestionDto[], question: QuestionDto): void {
    list.forEach((q, idx) => {
      if (q.id === question.parentId && !q.children.some(x => x.id === question.id)) {
        list[idx].children.unshift(question);
        list[idx].replyCount += 1;
        this.loadedReplyCount[q.id] += 1;
        return;
      }
    });
  }

  private forceUpdateQuestion(list: QuestionDto[], question: QuestionDto): void {
    list.forEach((q, idx) => {
      if (q.id === question.id) {
        list[idx] = question;
        return;
      } else if (q.children && q.children.length) {
        this.forceUpdateQuestion(q.children, question);
      }
    });
  }

  private createQuestion(): void {
    if (this.newQuestion && this.newQuestion.body && this.newQuestion.body.trim() && !this.isLoading) {
      this.isLoading = true;
      this.newQuestion.referenceId = this.referenceId;
      this._questionsService.create(this.newQuestion)
        .pipe(
          takeUntil(this.destroyed$),
          finalize(() => {
            this.isLoading = false;
          }),
        )
        .subscribe(response => {
          this.notify.success(this.l('SuccessfullySubmitted'));
          this.newQuestion = new QuestionDto();
          response.questionReactions = [];
          response.children = [];
          response.replyCount = 0;
          this.questions.unshift(response);
          this.loadedReplyCount[response.id] = 0;
          this.newReply[this.questions.length-1] = new QuestionDto();

          this.sendQuestionSignal(new QuestionSignalData(QuestionAction.Created, response));
        });
    }
  }

  private createReply(parent: QuestionDto, replyIndex: number): void {
    const reply = this.newReply[replyIndex];
    if (reply && reply.body && reply.body.trim() && !this.isLoading) {
      this.isLoading = true;
      reply.referenceId = this.referenceId;
      reply.parentId = parent.id;
      this._questionsService.create(reply)
        .pipe(
          takeUntil(this.destroyed$),
          finalize(() => {
            this.isLoading = false;
          }),
        )
        .subscribe(response => {
          this.notify.success(this.l('SuccessfullySubmitted'));
          this.newReply[replyIndex] = new QuestionDto();
          response.questionReactions = [];
          response.replyCount = 0;
          parent.children = [response, ...parent.children];
          parent.replyCount++;
          this.loadedReplyCount[parent.id]++;
          this.isReplying = [];
          this.sendQuestionSignal(new QuestionSignalData(QuestionAction.Replied, response));
        });
    }
  }

  private getQuestions(): void {
    this.isQuestionsLoading = true;
    this.questions = [];
    this.loadedReplyCount = [];
    this.isReplying = [];

    this._questionsService.getAll(this.referenceId, this.hostId, this.answered, this.creatorId)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isQuestionsLoading = false;
        })
      )
      .subscribe(responses => {
        for (let index = 0; index < responses.length; index++) {
          this.newReply[index] = new QuestionDto();
        }

        this.questions = responses;
        _.each(this.questions, question => {
          this.loadedReplyCount[question.id] = 0;
          this.getReplies(question);
        });
      });
  }

  private getReplies(question: QuestionDto): void {
    this._questionsService.getAllReplies(
      question.id,
      this.loadedReplyCount[question.id],
      this.loadedReplyCount[question.id] === 0 ? 1 : this._maxRepliesToLoad
    )
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        if (this.loadedReplyCount[question.id] === 0) {
          question.children = response.items;
        } else {
          question.children = [...question.children, ...response.items];
        }
        this.loadedReplyCount[question.id] += response.items.length;
      });
  }

  private async sendQuestionSignal(data: QuestionSignalData, callback?: () => void): Promise<void> {
    const sSignalData = JSON.stringify(data);
    const ids = [this.hostId].concat(this.attendeeIds ?? []).filter(i => i !== this.userId);
    await this.questionsHub.invoke('sendSignal', ids, sSignalData).then(() => { if (callback) callback(); });
  }
}
