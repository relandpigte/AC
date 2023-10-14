import { Component, Injector, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';

import { AppComponentBase } from '@shared/app-component-base';
import { DocumentDto, QuestionDto } from '@shared/service-proxies/service-proxies';
import { EventQuestionsComposerComponent } from '@shared/components/event-questions-composer/event-questions-composer.component';
import { Moment } from 'moment';

@Component({
  selector: 'app-event-questions',
  templateUrl: './event-questions.component.html',
  styleUrls: ['./event-questions.component.less'],
})
export class EventQuestionsComponent extends AppComponentBase implements OnInit {
  @Input() question: QuestionDto;
  @Input() showComposer = true;
  @Input() isHost: boolean;
  @Input() isAnswer: boolean;
  @Input() selectedQuestionType: number;

  @Output() onCreateQuestion: Subject<QuestionDto> = new Subject<QuestionDto>();
  @Output() onVote: Subject<QuestionDto> = new Subject<QuestionDto>();
  @Output() onAnswerLive: Subject<QuestionDto> = new Subject<QuestionDto>();

  @ViewChild(EventQuestionsComposerComponent) composer: EventQuestionsComposerComponent;

  replyingToQuestion: QuestionDto;
  showAnswers = false;

  constructor(injector: Injector) {
    super(injector);
  }

  get body(): string { return this.question?.body; }
  get time(): Moment { return this.question?.creationTime; }
  get fullName(): string { return this.question?.creatorUser?.fullName; }
  get profilePicture(): DocumentDto { return this.question?.creatorUser?.profilePictureDocument; }
  get isReplying(): boolean { return this.question?.id === this.replyingToQuestion?.id; }
  get answers(): QuestionDto[] { return this.question?.children; }
  get replyCount(): number { return this.question?.replyCount; }
  get totalReactions(): number { return this.question?.questionReactions?.length; }

  ngOnInit(): void {
  }

  handleCreateQuestion(question: QuestionDto): void {
    if (!!this.replyingToQuestion) {
      question.parentId = this.replyingToQuestion.id;
    }
    this.onCreateQuestion.next(question);
    setTimeout((): void => this.composer.textBody.nativeElement.focus());
    this.showAnswers = true;
  }

  handleVote(question: QuestionDto): void {
    this.onVote.next(question);
  }

  handleReply(question: QuestionDto): void {
    this.replyingToQuestion = question;
    setTimeout((): void => this.composer.textBody.nativeElement.focus());
  }

  handleShowAnswers(): void {
    this.showAnswers = true;
  }

  handleOnEscapeQuestion(): void {
    this.replyingToQuestion = null;
  }
}
