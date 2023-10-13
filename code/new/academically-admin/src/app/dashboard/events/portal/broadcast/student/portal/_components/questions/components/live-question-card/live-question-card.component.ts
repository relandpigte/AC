import { Component, Injector, Input, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { DocumentDto, QuestionDto } from '@shared/service-proxies/service-proxies';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-live-question-card',
  templateUrl: './live-question-card.component.html',
  styleUrls: ['./live-question-card.component.less']
})
export class LiveQuestionCardComponent extends AppComponentBase implements OnInit {
  @Input() question: QuestionDto;
  @Input() isHost: boolean;
  @Input() referenceId: string;
  @Output() onStartAnswering: Subject<QuestionDto> = new Subject<QuestionDto>();
  @Output() onEndAnswering: Subject<QuestionDto> = new Subject<QuestionDto>();

  isAnswering: boolean;

  constructor(
    injector: Injector
  ) {
    super(injector);
  }

  get profilePicture(): DocumentDto { return this.question?.creatorUser?.profilePictureDocument; }
  get profileName(): string { return this.question?.creatorUser?.fullName; }
  get body(): string { return this.question.body; }
  get isEventReferenced(): boolean { return this.question?.referenceId === this.referenceId; }

  ngOnInit(): void {
  }

  handleAnswerQuestion(question: QuestionDto): void {
    this.isAnswering = true;
    this.onStartAnswering.next(question);
  }

  handleEndAnswering(question: QuestionDto): void {
    this.onEndAnswering.next(question);
  }

  handleCancelAnswer(): void {
    this.onStartAnswering.next(null);
    this.isAnswering = false;
  }
}
