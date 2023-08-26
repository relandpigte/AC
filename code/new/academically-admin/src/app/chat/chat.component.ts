import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ChatModel, ChatService } from '@shared/services/chat.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.less']
})
export class ChatComponent extends AppComponentBase implements OnInit {
  replyingTo: ChatModel;

  constructor(
    injector: Injector,
    private _chatService: ChatService
  ) {
    super(injector);

    this._chatService.replyToMessage$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(replyingTo => this.replyingTo = replyingTo);
  }

  ngOnInit(): void {
  }

  handleOnReply(): void {
    console.log('this triggered!');
  }
}
