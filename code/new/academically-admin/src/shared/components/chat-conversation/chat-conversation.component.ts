import { Component, Injector, Input, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ChatModel } from '@app/chat/_services/chat.service';

@Component({
  selector: 'app-chat-conversation',
  templateUrl: './chat-conversation.component.html',
  styleUrls: ['./chat-conversation.component.less']
})
export class ChatConversationComponent extends AppComponentBase implements OnInit {
  @Input() data: ChatModel;

  constructor(injector: Injector) {
    super(injector);
  }

  get chatMessage(): string { return this.data?.message; }
  get isSender(): boolean { return this.data?.creatorUserId.toString() === this.appSession.userId.toString(); }

  ngOnInit(): void {
  }

}
