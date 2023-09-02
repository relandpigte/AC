import { AfterViewChecked, ChangeDetectorRef, Component, ElementRef, EventEmitter, Injector, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { switchMap, takeUntil } from 'rxjs/operators';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { MessageInfoComponent } from '@app/chat/_components/conversation/_components/message-info/message-info.component';
import { ChannelModel, ChatModel, ChatService } from '@shared/services/chat.service';
import { ServiceCard } from '@shared/models/service-card.model';
import { ServiceCardUtils } from '@shared/helpers/service-card-utils';
import { ModalDialogOptions, ModalDialogService } from '@shared/services/modal-dialog.service';
import { ChannelMessagesStateService } from '@shared/services/channel-messages-state.service';
import { HubService } from '@app/_shared/services/hub.service';
import { ChannelDto, ChannelMessageDto, ChatsServiceProxy } from '@shared/service-proxies/service-proxies';
import { BehaviorSubject, combineLatest, of } from 'rxjs';
import { AppStateConfig, AppStateServices } from '@shared/services/pub-sub.service';
import { StateUpdateType } from '@shared/services/state-base.service';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.less']
})
export class ConversationComponent extends AppComponentBase implements OnInit, OnChanges, AfterViewChecked {
  channelMessagesStateService: ChannelMessagesStateService;

  @ViewChild('scrollContent', { static: true }) content?: ElementRef<HTMLDivElement>;
  @ViewChild('scrollWrapper', { static: true }) wrapper?: ElementRef<HTMLDivElement>;

  @Input() channel: ChannelDto;
  @Input() hasActions = true;
  @Input() hasClose = false;
  @Input() showAttachmentInfo = true;

  @Output() onActionClick: EventEmitter<any> = new EventEmitter();
  @Output() onCloseClick: EventEmitter<any> = new EventEmitter();

  channelMessages: ChannelMessageDto[] = [];
  totalChannelMessagesCount = 0;

  attachedService: ServiceCard;

  isLoadingMessages$ = new BehaviorSubject<boolean>(true);

  constructor(
    injector: Injector,
    private _cdr: ChangeDetectorRef,
    private _chatService: ChatService,
    private _hubService: HubService,
    private _chatsService: ChatsServiceProxy,
    private _modalService: BsModalService,
    private _modalDialogService: ModalDialogService
  ) {
    super(injector);
  }

  get isLoading$() { return combineLatest(this.loadingSources$).pipe(switchMap((loaders) => of(loaders.some(l => l)))); }
  get loadingSources$() { return [ this.isLoadingMessages$ ]; }

  get selectedChannelId(): string { return this.channel.id; }
  get channelMessagesStateId(): string { return `chat-messages-${this.selectedChannelId}`; }

  async ngOnInit() {
    await this.initChannelMessagesAppStates();
  }

  async ngOnChanges(changes: SimpleChanges) {
    if ('channel' in changes && this.channel) {
      await this.channelMessagesStateService.updateServiceParams({ type: undefined, channelId: this.selectedChannelId });
      this.channelMessages = this.channelMessagesStateService.getAllChannelMessages();
      this.totalChannelMessagesCount = this.channelMessagesStateService.totalChannelMessagesCount;
    }
  }

  ngAfterViewChecked(): void {
    const { clientHeight } = this.content.nativeElement;
    this.wrapper.nativeElement.scrollTo(0, clientHeight);
  }

  private async initChannelMessagesAppStates() {
    const appStateConfig: AppStateConfig = {
        [this.channelMessagesStateId]: {
            load: [this.selectedChannelId],
            update: { channelId: this.selectedChannelId }
        }
    };
    const appStateServices: AppStateServices = {
        [this.channelMessagesStateId]: {
            type: ChannelMessagesStateService,
            args: [this._hubService, this._chatsService]
        }
    };
    await this.pubSubService.start(this, appStateConfig, appStateServices);
    this.channelMessagesStateService = this.pubSubService.getStateService<ChannelMessagesStateService>(this.channelMessagesStateId);
    this.channelMessagesStateService.loading$.pipe(takeUntil(this.destroyed$)).subscribe(loading => this.isLoadingMessages$.next(loading));
    this.channelMessagesStateService.channelMessages$.pipe(takeUntil(this.destroyed$)).subscribe(event => {
        switch(event.type) {
          case StateUpdateType.Add:
              this.channelMessages = [event.data].concat(this.channelMessages);
              this.totalChannelMessagesCount++;
              break;
          case StateUpdateType.Update:
              this.channelMessages = this.channelMessages.map(m => m.id === event.data.id ? event.data : m);
              break;
          case StateUpdateType.Delete:
              this.channelMessages = this.channelMessages.filter(m => m.id != event.data.id);
              this.totalChannelMessagesCount--;
              break;
        }
        this._cdr.detectChanges();
    });
    this.channelMessages = this.channelMessagesStateService.getAllChannelMessages();
    this.totalChannelMessagesCount = this.channelMessagesStateService.totalChannelMessagesCount;
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

  handleMessageReply(data: ChatModel): void {
    this._chatService.replyToMessage$.next(data);
  }

  handleCloseClick(): void {
    this.onCloseClick.emit();
  }

  handleArchiveChannel(): void {
    this._chatService.archiveChannel$.next(this.channel);
  }

  handleDeleteChannel(): void {
      const options: ModalDialogOptions = {
        title: this.l('DeleteThisConversation'),
        text: this.l('DeleteConversationConfirmation'),
        btnConfirmText: 'Delete',
        confirmCb: (): void => {
          this._chatService.deleteChannel$.next(this.channel);
        }
      };
      this._modalDialogService.showConfirmDialog(options);
  }
}
