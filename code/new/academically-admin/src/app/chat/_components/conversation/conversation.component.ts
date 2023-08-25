import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ChatModel, ChatService } from '@app/chat/_services/chat.service';
import { takeUntil } from 'rxjs/operators';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { MessageInfoComponent } from '@app/chat/_components/conversation/_components/message-info/message-info.component';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.less']
})
export class ConversationComponent extends AppComponentBase implements OnInit {
  data: ChatModel[] = [];

  constructor(
    injector: Injector,
    private _chatService: ChatService,
    private _modalService: BsModalService
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this._chatService.getData()
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => this.data = response);
  }

  handleMessageInfoPopup(data: ChatModel): void {
    const modalSettings = <ModalOptions<MessageInfoComponent>>this.defaultModalSettings;
    modalSettings.backdrop = true;
    modalSettings.ignoreBackdropClick = false;
    modalSettings.keyboard = true;
        modalSettings.class = 'modal-dialog-centered modal-sm modal-message-info';
    modalSettings.initialState = {
    };
    const modal = this._modalService.show(MessageInfoComponent, modalSettings).content;
  }

  handleMessageInfoPopupClose(): void {
    this._modalService.hide();
  }
}
