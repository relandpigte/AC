import { AfterViewChecked, Component, ElementRef, Injector, OnInit, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { takeUntil } from 'rxjs/operators';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { MessageInfoComponent } from '@app/chat/_components/conversation/_components/message-info/message-info.component';
import { ChatModel, ChatService } from '@shared/services/chat.service';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.less']
})
export class ConversationComponent extends AppComponentBase implements OnInit, AfterViewChecked {
  @ViewChild('scrollContent', { static: true }) content?: ElementRef<HTMLDivElement>;
  @ViewChild('scrollWrapper', { static: true }) wrapper?: ElementRef<HTMLDivElement>;

  data: ChatModel[] = [];

  constructor(
    injector: Injector,
    private _chatService: ChatService,
    private _modalService: BsModalService
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this._chatService.getChatData()
      .pipe(takeUntil(this.destroyed$))
      .subscribe(chat =>  this.data = chat );
  }

  ngAfterViewChecked(): void {
    const { clientHeight } = this.content.nativeElement;
    this.wrapper.nativeElement.scrollTo(0, clientHeight);
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
}
