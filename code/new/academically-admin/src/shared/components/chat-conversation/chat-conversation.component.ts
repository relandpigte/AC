import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ChannelMessageDto } from '@shared/service-proxies/service-proxies';
import { ChatService } from '@shared/services/chat.service';
import { ModalDialogOptions, ModalDialogService } from '@shared/services/modal-dialog.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-chat-conversation',
  templateUrl: './chat-conversation.component.html',
  styleUrls: ['./chat-conversation.component.less']
})
export class ChatConversationComponent extends AppComponentBase implements OnInit {
  @Input() data: ChannelMessageDto;

  @Output() onReplyClick: EventEmitter<ChannelMessageDto> = new EventEmitter();
  @Output() onMessageInfoClick: Subject<ChannelMessageDto> = new Subject<ChannelMessageDto>();

  constructor(
    injector: Injector,
    private _chatService: ChatService,
    private _modalDialogService: ModalDialogService
    ) {
    super(injector);
  }

  get chatMessage(): string { return this.data?.message; }
  get parentMessage(): ChannelMessageDto { return this.data?.parent; }
  get isSender(): boolean { return this.data?.creatorUserId.toString() === this.appSession.userId.toString(); }
  get isDeleted(): boolean { return this.data?.isDeleted; }

  ngOnInit(): void {
  }

  handleMessageInfoPopup(data: ChannelMessageDto): void {
    this.onMessageInfoClick.next(data);
  }

  handleMessageReply(): void {
    this.onReplyClick.emit(this.data);
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

  hasAttachedService(message: ChannelMessageDto): boolean {
    return !!(message?.article ?? message?.coaching ?? message?.course ?? message?.event ?? message?.video);
  }

  getAttachedService(message: ChannelMessageDto): any {
    return message?.article ?? message?.coaching ?? message?.course ?? message?.event ?? message?.video;
  }
}
