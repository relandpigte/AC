import { AfterViewChecked, Component, ElementRef, EventEmitter, Injector, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { takeUntil } from 'rxjs/operators';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { MessageInfoComponent } from '@app/chat/_components/conversation/_components/message-info/message-info.component';
import { ChatModel, ChatService } from '@shared/services/chat.service';
import { ServiceCard } from '@shared/models/service-card.model';
import { ServiceCardUtils } from '@shared/helpers/service-card-utils';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.less']
})
export class ConversationComponent extends AppComponentBase implements OnInit, AfterViewChecked {
  @ViewChild('scrollContent', { static: true }) content?: ElementRef<HTMLDivElement>;
  @ViewChild('scrollWrapper', { static: true }) wrapper?: ElementRef<HTMLDivElement>;

  @Input() hasActions = true;
  @Input() hasClose = false;
  @Input() showAttachmentInfo = true;

  @Output() onActionClick: EventEmitter<any> = new EventEmitter();
  @Output() onCloseClick: EventEmitter<any> = new EventEmitter();

  data: ChatModel[] = [];
  attachedService: ServiceCard;

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
      .subscribe(chat => {
        this.data = chat;
        this.getAttachedService();
      });
  }

  ngAfterViewChecked(): void {
    const { clientHeight } = this.content.nativeElement;
    this.wrapper.nativeElement.scrollTo(0, clientHeight);
  }

  private getAttachedService(): void {
    const { service } = ServiceCardUtils.getSanitizeServiceData(this.generateRandomCourse(), {}, [], false);
    this.attachedService = service;
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

  handleCloseClick(): void {
    this.onCloseClick.emit();
  }
}
