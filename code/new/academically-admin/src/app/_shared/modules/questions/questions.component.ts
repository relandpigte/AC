import { AfterViewInit, Component, Injector, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { QuestionDto, QuestionReactionDto, QuestionsServiceProxy, ReactionType } from '@shared/service-proxies/service-proxies';
import * as _ from 'lodash';
import { finalize, takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.less']
})
export class QuestionsComponent extends AppComponentBase implements AfterViewInit {
  @Input() isSidebar = true;
  @Input() referenceId: string;
  @Input() answered: boolean;
  @Input() creatorId: number;

  questions: QuestionDto[];
  isLoading = false;
  isQuestionsLoading = false;
  newQuestion = new QuestionDto();
  newReply: QuestionDto[] = [];
  isReplying: boolean[] = [];
  skipCount: number[] = [];
  loadedReplyCount: number[] = [];

  private _maxRepliesToLoad = 3;

  constructor(
    injector: Injector,
    route: ActivatedRoute,
    private _questionsService: QuestionsServiceProxy,
  ) {
    super(injector);
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

  onLikeClick(question: QuestionDto): void {
    const reaction = new QuestionReactionDto();
    reaction.questionId = question.id;
    reaction.type = ReactionType.Like;
    this._questionsService.createReaction(reaction)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        question.questionReactions.push(response);
      });
  }

  onUnlikeClick(question: QuestionDto): void {
    const index = question.questionReactions.findIndex(e => e.creatorUserId === this.appSession.userId);
    if (index >= 0) {
      this._questionsService.deleteReaction(question.questionReactions[index].id)
        .pipe(takeUntil(this.destroyed$))
        .subscribe(() => {
          question.questionReactions.splice(index, 1);
        });
    }
  }

  checkIfReacted(question: QuestionDto): boolean {
    return question.questionReactions.filter(e => e.creatorUserId === this.appSession.userId).length > 0;
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
          this.skipCount[parent.id]++;
          this.isReplying = [];
        });
    }
  }

  private getQuestions(): void {
    this.isQuestionsLoading = true;
    this.questions = [];
    this.skipCount = [];
    this.loadedReplyCount = [];
    this.isReplying = [];

    this._questionsService.getAll(this.referenceId, this.answered, this.creatorId)
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
    let count = 0;
    if (_.isNil(this.skipCount[question.id])) {
      this.skipCount[question.id] = 0;
      count = 1;
    } else {
      if (this.skipCount[question.id] === 0) {
        count = this._maxRepliesToLoad;
        this.skipCount[question.id] = 1;
      } else {
        const remainingReplyCount = (this.loadedReplyCount[question.id] - 1) % 3;
        if (remainingReplyCount === 0) {
          count = this._maxRepliesToLoad;
        } else {
          count = remainingReplyCount;
        }
        this.skipCount[question.id] += count;
      }
    }

    this._questionsService.getAllReplies(
      question.id,
      this.skipCount[question.id],
      count,
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
}
