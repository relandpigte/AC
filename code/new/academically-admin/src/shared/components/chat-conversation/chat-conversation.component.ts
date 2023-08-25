import { Component, Injector, Input, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ChatModel } from '@app/chat/_services/chat.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-chat-conversation',
  templateUrl: './chat-conversation.component.html',
  styleUrls: ['./chat-conversation.component.less']
})
export class ChatConversationComponent extends AppComponentBase implements OnInit {
  @Input() data: ChatModel;
  @Output() onMessageInfoClick: Subject<ChatModel> = new Subject<ChatModel>();

  constructor(injector: Injector) {
    super(injector);
  }

  get chatMessage(): string { return this.data?.message; }
  get isSender(): boolean { return this.data?.creatorUserId.toString() === this.appSession.userId.toString(); }

  ngOnInit(): void {
  }

  handleMessageInfoPopup(data: ChatModel): void {
    this.onMessageInfoClick.next(data);
  }
}
