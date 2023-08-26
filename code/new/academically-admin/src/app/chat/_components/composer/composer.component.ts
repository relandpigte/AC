import { Component, Injector, Input, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppComponentBase } from '@shared/app-component-base';
import { ChatModel, ChatService } from '@shared/services/chat.service';
import * as moment from 'moment';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-composer',
  templateUrl: './composer.component.html',
  styleUrls: ['./composer.component.less']
})
export class ComposerComponent extends AppComponentBase implements OnInit {
  model: ChatModel;

  @Input() replyingTo: ChatModel;
  @Output() onReply: Subject<any> = new Subject<any>();

  constructor(
    injector: Injector,
    private _chatService: ChatService
  ) {
    super(injector);
  }

  get replyingToRecipient(): string { return this.replyingTo?.creatorUser?.firstName ?? 'Miyah'; }
  get replyingToMessage(): string { return this.replyingTo?.message ?? 'I can even begin to express how good this final season'; }

  ngOnInit(): void {
  }

  handleWriteMessage(f: NgForm): void {
    if (f.value.message === '') {
      return;
    }
    this.model = {
      id: this.uuidv4(),
      message: f.value.message,
      creatorUserId: this.appSession.userId.toString(),
      creationTime: new Date(moment.now()),
      isSeen: new Date(moment.now())
    };

    if (this.replyingTo) {
      this.model.parentMessage = this.replyingTo;
    }

    this._chatService.addChatData(this.model);
    f.resetForm();
    this._chatService.replyToMessage$.next(null);
    this.onReply.next();
  }

  handleRemoveReplyTo(): void {
    this._chatService.replyToMessage$.next(null);
  }

  onMessageKeydown(event: any, f: NgForm): void {
    if (event.keyCode === 13) {
      f.ngSubmit.emit();
      event.preventDefault();
    }

    if (event.keyCode === 27) {
      // Escape - exit writing a message
    }
  }
}
