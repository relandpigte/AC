import { Component, Injector, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { NgForm } from '@angular/forms';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { ChatModel, ChatService } from '@shared/services/chat.service';

@Component({
  selector: 'app-composer',
  templateUrl: './composer.component.html',
  styleUrls: ['./composer.component.less']
})
export class ComposerComponent extends AppComponentBase implements OnInit {
  model: ChatModel;

  @Output() onReply: Subject<any> = new Subject<any>();

  constructor(
    injector: Injector,
    private _chatService: ChatService
  ) {
    super(injector);
  }

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

    this._chatService.addChatData(this.model);
    f.resetForm();
    this.onReply.next();
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
