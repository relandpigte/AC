import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Injector, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { HubService } from '@app/_shared/services/hub.service';
import { MessageInfoComponent } from '@app/chat/_components/conversation/_components/message-info/message-info.component';
import { AppComponentBase } from '@shared/app-component-base';
import { ServiceCardUtils } from '@shared/helpers/service-card-utils';
import { ServiceCard } from '@shared/models/service-card.model';
import { ChannelDto, ChannelMessageDto, ChatsServiceProxy, DocumentDto, UserDto, UserServiceProxy, MatchedChannelDto } from '@shared/service-proxies/service-proxies';
import { ChannelMessagesStateService } from '@shared/services/channel-messages-state.service';
import { ChatService, NotificationType } from '@shared/services/chat.service';
import { ModalDialogOptions, ModalDialogService } from '@shared/services/modal-dialog.service';
import { AppStateConfig, AppStateServices } from '@shared/services/pub-sub.service';
import { StateUpdateType } from '@shared/services/state-base.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, combineLatest, of, Subject } from 'rxjs';
import { debounceTime, switchMap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.less']
})
export class ConversationComponent extends AppComponentBase implements OnInit, OnChanges {
  channelMessagesStateService: ChannelMessagesStateService;

  @ViewChild('scrollContent', { static: true }) content?: ElementRef<HTMLDivElement>;
  @ViewChild('scrollWrapper', { static: true }) wrapper?: ElementRef<HTMLDivElement>;

  @Input() channel: ChannelDto;
  @Input() hasActions = true;
  @Input() hasClose = false;
  @Input() showAttachmentInfo = true;
  @Input() isRecipientTyping = false;

  @Input() blockUserIds: number[] = [];
  @Input() isUserBlocked: boolean;
  @Input() blockedByUser: number[];

  @Output() onActionClick: EventEmitter<any> = new EventEmitter();
  @Output() onCloseClick: EventEmitter<any> = new EventEmitter();
  @Output() onBlockUser: EventEmitter<any> = new EventEmitter();
  @Output() onUnblockUser: EventEmitter<any> = new EventEmitter();

  channelMessages: ChannelMessageDto[] = [];
  totalChannelMessagesCount = 0;
  replyingToUser: UserDto;
  unSubscribedIds: number[] = [];

  attachedService: ServiceCard;

  selectedMatchedChannel: MatchedChannelDto;
  selectedMatchedCount = 1;

  isLoadingMessages$ = new BehaviorSubject<boolean>(true);
  seenMessagesTrigger$ = new Subject();

  constructor(
    injector: Injector,
    private _cdr: ChangeDetectorRef,
    private _elRef: ElementRef,
    private _chatService: ChatService,
    private _hubService: HubService,
    private _chatsService: ChatsServiceProxy,
    private _modalService: BsModalService,
    private _modalDialogService: ModalDialogService,
    private _userService: UserServiceProxy
  ) {
    super(injector);
  }

  get isLoading$() { return combineLatest(this.loadingSources$).pipe(switchMap((loaders) => of(loaders.some(l => l)))); }
  get loadingSources$() { return [ this.isLoadingMessages$ ]; }

  get selectedChannelId(): string { return this.channel?.id; }
  get channelMessagesStateId(): string { return `chat-messages-${this.selectedChannelId}`; }

  get lastMessage(): ChannelMessageDto { return this.channelMessages?.length ? this.channelMessages[this.channelMessages.length - 1] : null; }
  get isShowLastMessageInfo(): boolean { return this.lastMessage?.creatorUserId === this.appSession.userId; }
  get lastMessageInfoStr(): string {
    if (this.lastMessage.isSeen) return 'Seen';
    else return 'Delivered';
  }

  get isBlockedByRecipient(): boolean {
    const blockByRecipient = this.channel?.members.find(m => m.userId !== this.appSession.userId);
    return this.blockedByUser?.includes(blockByRecipient?.userId);
  }

  get userId(): number { return this.replyingToUser?.id; }
  get profileDocument(): DocumentDto { return this.replyingToUser?.profilePictureDocument; }
  get recipientName(): string { return this.replyingToUser?.name; }
  get recipientFullName(): string { return this.replyingToUser?.fullName; }
  get notificationType() { return NotificationType; }
  get isMuteNotifications(): boolean { return this.unSubscribedIds?.includes(this.appSession.userId); }

  async ngOnInit(): Promise<void> {
    this._chatService.replyingToUser$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(user => this.replyingToUser = user);

    this._chatService.selectedMatchedChannel$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(channel => {
        this.selectedMatchedChannel = channel;
        this._chatService.selectedMatchedCount$.next(1);
      });

    this._chatService.selectedMatchedCount$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(count => {
        this.selectedMatchedCount = count;
        this.focusOnMatch(this.selectedMatchedCount);
      });

    this.seenMessagesTrigger$
      .pipe(debounceTime(1000))
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => this.handleSeenMessages());

    this.getUnsubscribedIds();
    this._cdr.detectChanges();
  }

  async ngOnChanges(changes: SimpleChanges) {
    if ('channel' in changes && this.channel) {
      await this.initChannelMessagesAppStates();
      await this.channelMessagesStateService.updateServiceParams({ type: undefined, channelId: this.selectedChannelId });
      this.channelMessages = this.channelMessagesStateService.getAllChannelMessages();
      this.totalChannelMessagesCount = this.channelMessagesStateService.totalChannelMessagesCount;
      if (this.selectedMatchedChannel) this.initSearchResults();
    }
  }

  handleBlockUser(): void {
    this.onBlockUser.next();
  }

  handleUnblockUser(): void {
    this.onUnblockUser.next();
  }

  getUnsubscribedIds(): void {
    this.unSubscribedIds = this.channel?.channelNotifications?.map(n => n.creatorUserId);
  }

  handleNotification(type: NotificationType): void {
    const chatNotification = type === NotificationType.Mute ?
      this._chatsService.createChannelNotification(this.channel?.id) :
      this._chatsService.deleteChannelNotification(this.channel?.id);

    chatNotification.pipe(takeUntil(this.destroyed$))
      .subscribe((): void => {
        if (type === this.notificationType.Mute) {
          this.unSubscribedIds.push(this.appSession.userId);
        } else {
          this.unSubscribedIds = this.unSubscribedIds.filter(s => s !== this.appSession.userId);
        }
      });
  }

  private async initChannelMessagesAppStates() {
    if (this.channelMessagesStateService) {
      await this.channelMessagesStateService.stop();
    }

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
              this.channelMessages = this.channelMessages.concat([event.data]);
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
        this.focusLatestUnreadMessage();
    });
    this.channelMessages = this.channelMessagesStateService.getAllChannelMessages();
    this.totalChannelMessagesCount = this.channelMessagesStateService.totalChannelMessagesCount;
    this.focusLatestUnreadMessage();
  }

  private focusLatestUnreadMessage(): void {
    setTimeout(() => {
      let latestMessage = null;
      if (this.channelMessages?.length) {
        latestMessage = this.channelMessages[this.channelMessages.length - 1];
        let latestUnseenMessageIdx = null;
        if (latestMessage.creatorUserId !== this.appSession.userId) {
          const unseenMessages = this.channelMessages.filter(m => !m.isSeen);
          const oldestUnseenMessage = unseenMessages ? _.minBy(unseenMessages, 'creationTime') : null;
          latestUnseenMessageIdx = oldestUnseenMessage ? this.channelMessages.findIndex(m => m.id === oldestUnseenMessage.id) : null;
        }
        latestMessage = latestUnseenMessageIdx ? this.channelMessages[latestUnseenMessageIdx] : latestMessage;
      }

      if (latestMessage) {
        this._elRef.nativeElement.querySelector(`#msg-${latestMessage.id}`)?.scrollIntoView({ behavior: 'smooth' });
        this.seenMessagesTrigger$.next();
      } else {
        this.wrapper.nativeElement.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  private getAttachedService(): void {
    const { service } = ServiceCardUtils.getSanitizeServiceData(this.generateRandomCourse(), {}, [], false);
    this.attachedService = service;
  }

  // tslint:disable-next-line: member-ordering
  handleMessageInfoPopup(data: ChannelMessageDto): void {
    const modalSettings = <ModalOptions<MessageInfoComponent>>this.defaultModalSettings;
    modalSettings.backdrop = true;
    modalSettings.ignoreBackdropClick = false;
    modalSettings.keyboard = true;
        modalSettings.class = 'modal-dialog-centered modal-sm modal-message-info';
    modalSettings.initialState = {
      channelMessage: data
    };
    const modal = this._modalService.show(MessageInfoComponent, modalSettings).content;
  }

  async handleSeenMessages() {
    this._chatsService.seenChannelMessages(this.selectedChannelId, moment()).subscribe(() => {});
  }

  handleMessageReply(data: ChannelMessageDto): void {
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

  protected readonly NotificationType = NotificationType;

  initSearchResults(): void {
    setTimeout(() => {
      if (this.selectedMatchedChannel) {
        let idx = 1;
        const rgx = new RegExp(`(${this.selectedMatchedChannel.keyword})`, 'ig');
        this.selectedMatchedChannel?.channel?.messages?.forEach(m => {
          const message = this._elRef.nativeElement.querySelector(`#msg-${m.id}`);
          if (message) {
            const messageContent = message.querySelector('.message-content');
            if (messageContent) {
              messageContent.innerHTML = messageContent.innerHTML.replace(rgx, (a, b) => `<span class="match match-${idx++}">${b}</span>`);
            }
          }
        });
        this._chatService.selectedMatchedCount$.next(1);
      }
    }, 1000);
  }

  focusOnMatch(idx: number): void {
    setTimeout(() => {
      this._elRef.nativeElement.querySelectorAll(`.match`).forEach(m => {
        m.classList.remove('active');
        if (m.classList.contains(`match-${idx}`)) {
          m.classList.add('active');
          m.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'center'
          });
        }
      });
    });
  }

  handleOnNextMatch(): void {
    if (this.selectedMatchedChannel) {
      this.selectedMatchedCount++;
      if (this.selectedMatchedCount > this.selectedMatchedChannel.matchCount) this.selectedMatchedCount = 1;
      this._chatService.selectedMatchedCount$.next(this.selectedMatchedCount);
    }
  }

  handleOnPreviousMatch(): void {
    if (this.selectedMatchedChannel) {
      this.selectedMatchedCount--;
      if (this.selectedMatchedCount === 0) this.selectedMatchedCount = this.selectedMatchedChannel.matchCount;
      this._chatService.selectedMatchedCount$.next(this.selectedMatchedCount);
    }
  }
}
