import { Component, Injector, Output, OnInit, Input, ElementRef, ViewChild  } from '@angular/core';
import { Subject } from 'rxjs';

import { AppComponentBase } from '@shared/app-component-base';
import { QuestionDto } from '@shared/service-proxies/service-proxies';
import { NgForm } from '@node_modules/@angular/forms';

@Component({
  selector: 'app-event-questions-composer',
  templateUrl: './event-questions-composer.component.html',
  styleUrls: ['./event-questions-composer.component.less']
})
export class EventQuestionsComposerComponent extends AppComponentBase implements OnInit {
  @ViewChild('textBody', { static: true }) textBody: ElementRef<HTMLTextAreaElement>;

  @Input() isReplying: boolean;
  @Output() onCreateQuestion: Subject<QuestionDto> = new Subject<QuestionDto>();
  @Output() onEscapeQuestion: Subject<any> = new Subject<any>();

  newQuestion = new QuestionDto();

  constructor(
    injector: Injector
  ) {
    super(injector);
  }

  get userProfile(): string { return this.appSession.user.profilePictureUrl; }
  get userName(): string { return this.appSession.user.name; }

  ngOnInit(): void {
  }

  onMessageKeydown(event: any, form: NgForm): void {
    if (event.keyCode === 13) {
      form.ngSubmit.emit();
      event.preventDefault();
    }
    if (event.keyCode === 27) {
      this.onEscapeQuestion.next();
    }
  }

  handleCreateQuestion(form: NgForm): void {
    this.onCreateQuestion.next(this.newQuestion);
    form.resetForm();
  }
}
