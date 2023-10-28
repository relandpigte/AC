import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { FileUtils } from '@shared/helpers/file-utils';
import { ChannelMessageDto, ChatsServiceProxy } from '@shared/service-proxies/service-proxies';
import { ChatService } from '@shared/services/chat.service';
import { ModalDialogService } from '@shared/services/modal-dialog.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-chat-conversation-message',
  templateUrl: './chat-conversation-message.component.html',
  styleUrls: ['./chat-conversation-message.component.less']
})
export class ChatConversationMessageComponent extends AppComponentBase implements OnInit {
  @Input() data: ChannelMessageDto;
  @Input() isBlockedByRecipient: boolean;
  @Input() isSidebar: boolean;

  @Output() onReplyClick: EventEmitter<ChannelMessageDto> = new EventEmitter();
  @Output() onMessageInfoClick: Subject<ChannelMessageDto> = new Subject<ChannelMessageDto>();
  @Output() onDeleteMessage: Subject<string> = new Subject<string>();

  fileAttachment: File;

  constructor(
    injector: Injector,
    private _chatService: ChatService,
    private _modalDialogService: ModalDialogService,
    private _chatsService: ChatsServiceProxy
    ) {
    super(injector);
  }

  get chatMessage(): string { return this.data?.message; }
  get parentMessage(): ChannelMessageDto { return this.data?.parent; }
  get isSender(): boolean { return this.data?.creatorUserId.toString() === this.appSession.userId.toString(); }
  get isDeleted(): boolean { return this.data?.isDeleted; }

  async ngOnInit(): Promise<void> {
    await this.getFileAttachment();
  }

  handleMessageInfoPopup(data: ChannelMessageDto): void {
    this.onMessageInfoClick.next(data);
  }

  handleMessageReply(): void {
    this.onReplyClick.emit(this.data);
  }

  handleMessageDelete(channelMessageId: string): void {
    this.onDeleteMessage.next(channelMessageId);
  }

  hasAttachedService(message: ChannelMessageDto): boolean {
    return !!(message?.article ?? message?.coaching ?? message?.course ?? message?.event ?? message?.video);
  }

  getAttachedService(message: ChannelMessageDto): any {
    return message?.article ?? message?.coaching ?? message?.course ?? message?.event ?? message?.video;
  }

  private async getFileAttachment(): Promise<void> {
    if (this.data.channelMessageAttachments) {
      const [file] = this.data.channelMessageAttachments;
      if (file) {
        const document = file.document;
        if (document) {
          this.fileAttachment = await FileUtils.getFileBlob(file.documentUrl, document.name, document.fileType);
        }
      }
    }
  }
}
