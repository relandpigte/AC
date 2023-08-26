import { Component, Injector, Input, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { Subject } from 'rxjs';
import { ChatModel, ChatService } from '@shared/services/chat.service';
import { ModalDialogOptions, ModalDialogService } from '@shared/services/modal-dialog.service';

@Component({
  selector: 'app-chat-conversation',
  templateUrl: './chat-conversation.component.html',
  styleUrls: ['./chat-conversation.component.less']
})
export class ChatConversationComponent extends AppComponentBase implements OnInit {
  @Input() data: ChatModel;
  @Output() onMessageInfoClick: Subject<ChatModel> = new Subject<ChatModel>();

  constructor(
    injector: Injector,
    private _chatService: ChatService,
    private _modalDialogService: ModalDialogService
    ) {
    super(injector);
  }

  get chatMessage(): string { return this.data?.message; }
  get isSender(): boolean { return this.data?.creatorUserId.toString() === this.appSession.userId.toString(); }
  get isDeleted(): boolean { return this.data?.isDeleted; }

  ngOnInit(): void {
  }

  handleMessageInfoPopup(data: ChatModel): void {
    this.onMessageInfoClick.next(data);
  }

  handleMessageDelete(chatId: string): void {
    const options: ModalDialogOptions = {
      title: this.l('DeleteThisMessage'),
      text: this.l('DeleteMessageConfirmation'),
      btnConfirmText: 'Delete',
      confirmCb: (): void => {
        this._chatService.removeChatData(chatId);
      }
    };
    this._modalDialogService.showConfirmDialog(options);
  }
}
