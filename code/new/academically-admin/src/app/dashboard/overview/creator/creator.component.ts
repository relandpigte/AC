import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { DashboardPagesService } from '@shared/services/dashboard-pages.service';
import { ChatService } from '@shared/services/chat.service';
import { ChatsServiceProxy, UserDto } from '@shared/service-proxies/service-proxies';
import { BsModalService, ModalOptions } from '@node_modules/ngx-bootstrap/modal';
import {
  ChatComposerConversationComponent
} from '@shared/components/chat-composer-conversation/chat-composer-conversation.component';
import { takeUntil } from '@node_modules/rxjs/operators';

@Component({
  selector: 'app-creator',
  templateUrl: './creator.component.html',
  styleUrls: ['./creator.component.less']
})
export class CreatorComponent extends AppComponentBase implements OnInit {

  constructor(
    injector: Injector,
    private _dashboardPageService: DashboardPagesService,
    private _chatService: ChatService,
    private _chatsService: ChatsServiceProxy,
    private _modalService: BsModalService
  ) {
    super(injector);
  }

  get isLoading$() { return this._dashboardPageService.isLoading$; }
  get userId(): number { return  this.appSession.userId; }

  ngOnInit(): void {
    this._chatService.openChat$.subscribe((user) => this.openMessageModal(user));
  }

  private async openMessageModal(user: UserDto): Promise<void> {
    const channel = await this._chatsService.getChannelByRecipient(user.id, this.userId).toPromise();
    this._chatService.replyingToUser$.next(user);

    const modalSettings = this.defaultModalSettings as ModalOptions<ChatComposerConversationComponent>;
    modalSettings.class = 'modal-lg';
    modalSettings.initialState = {
      hasActions: false,
      hasClose: true,
      showAttachmentInfo: false,
      channel: !!channel?.id ? channel : null,
      isSearchingUser: false
    };
    const modal = this._modalService.show(ChatComposerConversationComponent, modalSettings);
    modal.content.onCloseClick
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => modal.hide());
  }
}
