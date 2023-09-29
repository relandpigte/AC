import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Injector, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { HubService } from '@app/_shared/services/hub.service';
import { AppComponentBase } from '@shared/app-component-base';
import { ServiceCardUtils } from '@shared/helpers/service-card-utils';
import { ServiceCard } from '@shared/models/service-card.model';
import { ChannelDto, ChannelMessageDto, ChatsServiceProxy, UserDto, MatchedChannelDto, UserStatus, UserServiceProxy } from '@shared/service-proxies/service-proxies';
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
import { UserAvatarService } from '@shared/services/user-avatar.service';
import { ChatMessageInfoComponent } from '@shared/components/chat-message-info/chat-message-info.component';
import { AvatarType } from '@shared/components/user-avatar/user-avatar.component';
import { UserAvatarStateService } from '@shared/services/user-avatar-state.service';

@Component({
  selector: 'app-chat-conversation',
  templateUrl: './chat-conversation.component.html',
  styleUrls: ['./chat-conversation.component.less']
})
export class ChatConversationComponent extends AppComponentBase implements OnInit, OnChanges {
  channelMessagesStateService: ChannelMessagesStateService;
  userAvatarStateService: UserAvatarStateService;

  @ViewChild('scrollContent', { static: true }) content?: ElementRef<HTMLDivElement>;
  @ViewChild('scrollWrapper', { static: true }) wrapper?: ElementRef<HTMLDivElement>;

  @Input() minTime: moment.Moment;
  @Input() channel: ChannelDto;
  @Input() hasActions = true;
  @Input() hasClose = false;
  @Input() showAttachmentInfo = true;
  @Input() showMessageStatus = true;
  @Input() isRecipientTyping = false;
  @Input() mutedUserChannelIds: string[];
  @Input() isSidebar: boolean;

  @Input() blockUserIds: number[] = [];
  @Input() isUserBlocked: boolean;
  @Input() blockedByUser: number[];

  @Output() onActionClick: EventEmitter<any> = new EventEmitter();
  @Output() onCloseClick: EventEmitter<any> = new EventEmitter();
  @Output() onBlockUser: EventEmitter<any> = new EventEmitter();
  @Output() onUnblockUser: EventEmitter<any> = new EventEmitter();
  @Output() onProcessNotification: EventEmitter<NotificationType> = new EventEmitter<NotificationType>();

  channelMessages: ChannelMessageDto[] = [];
  totalChannelMessagesCount = 0;
  notificationType = NotificationType;
  attachedService: ServiceCard;

  selectedMatchedChannel: MatchedChannelDto;
  selectedMatchedCount = 1;

  isLoadingMessages$ = new BehaviorSubject<boolean>(true);
  seenMessagesTrigger$ = new Subject();

  onlineUsers: UserDto[] = [];
  inactiveUsers: UserDto[] = [];
  avatarType = AvatarType;
  sendToUser: UserDto;

  timer: any;

  constructor(
    injector: Injector,
    private _cdr: ChangeDetectorRef,
    private _elRef: ElementRef,
    private _chatService: ChatService,
    private _hubService: HubService,
    private _chatsService: ChatsServiceProxy,
    private _modalService: BsModalService,
    private _modalDialogService: ModalDialogService,
    private _userAvatarService: UserAvatarService,
    private _userService: UserServiceProxy
  ) {
    super(injector);
  }

  get isLoading$() { return combineLatest(this.loadingSources$).pipe(switchMap((loaders) => of(loaders.some(l => l)))); }
  get loadingSources$() { return [ this.isLoadingMessages$ ]; }

  get selectedChannelId(): string { return this.channel?.id; }
  get channelMessagesStateId(): string { return `chat-messages-${this.selectedChannelId}`; }

  get lastMessage(): ChannelMessageDto { return this.channelMessages?.length ? this.channelMessages[this.channelMessages.length - 1] : null; }
  get isShowLastMessageInfo(): boolean { return this.showMessageStatus && this.lastMessage?.creatorUserId === this.appSession.userId; }
  get lastMessageInfoStr(): string {
    if (this.lastMessage.isSeen) return 'Seen';
    else return 'Delivered';
  }

  get isBlockedByRecipient(): boolean {
    const blockByRecipient = this.channel?.members?.find(m => m.userId !== this.appSession.userId);
    return this.blockedByUser?.includes(blockByRecipient?.userId);
  }

  get userId(): number { return this.replyingToUser?.id; }
  get replyingToUser(): UserDto { return this.channel?.members?.find(m => m.userId !== this.appSession.userId)?.user ?? this.sendToUser; }
  get recipientName(): string { return this.replyingToUser?.name; }
  get isMutedChannel() { return this.mutedUserChannelIds?.includes(this.channel?.id); }

  get loggedInUserStateId(): string { return 'onlineUsers'; }

  async ngOnInit(): Promise<void> {
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

    this._userAvatarService.getUserStatusLog()
      .pipe(takeUntil(this.destroyed$))
      .subscribe(data => {
        this.onlineUsers = this._userAvatarService.getAllUserLogByStatus(UserStatus.Online, data);
        this.inactiveUsers = this._userAvatarService.getAllUserLogByStatus(UserStatus.Away, data);
      });

    this._chatService.replyingToUser$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(user => this.sendToUser = user);

    this._cdr.detectChanges();
  }

  async ngOnChanges(changes: SimpleChanges) {
    if ('channel' in changes && this.channel) {
      await this.initChannelMessagesAppStates();
      await this.initUserAvatarAppState();
      await this.channelMessagesStateService.updateServiceParams({ type: undefined, args: [this.selectedChannelId, this.minTime] });
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

  handleNotification(type: NotificationType): void {
    this.onProcessNotification.next(type);
  }

  private async initChannelMessagesAppStates() {
    if (this.channelMessagesStateService) {
      await this.channelMessagesStateService.stop();
    }

    const appStateConfig: AppStateConfig = {
        [this.channelMessagesStateId]: {
            load: [this.selectedChannelId, this.minTime],
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
        switch (event.type) {
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
          latestUnseenMessageIdx = oldestUnseenMessage ? this.channelMessages?.findIndex(m => m.id === oldestUnseenMessage.id) : null;
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
    const modalSettings = <ModalOptions<ChatMessageInfoComponent>>this.defaultModalSettings;
    modalSettings.backdrop = true;
    modalSettings.ignoreBackdropClick = false;
    modalSettings.keyboard = true;
        modalSettings.class = 'modal-dialog-centered modal-sm modal-message-info';
    modalSettings.initialState = {
      channelMessage: data
    };
    const modal = this._modalService.show(ChatMessageInfoComponent, modalSettings).content;
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

  private async initUserAvatarAppState(): Promise<void> {
    const appStateConfig: AppStateConfig = {
      [this.loggedInUserStateId]: {
        load: [this.appSession.userId],
        update: {}
      }
    };
    const appStateServices: AppStateServices = {
      [this.loggedInUserStateId]: {
        type: UserAvatarStateService,
        args: [this._hubService, this._userService]
      }
    };
    await this.pubSubService.start(this, appStateConfig, appStateServices);
    this.userAvatarStateService = this.pubSubService.getStateService<UserAvatarStateService>(this.loggedInUserStateId);
    this.userAvatarStateService.userStatusLog$.pipe(takeUntil(this.destroyed$)).subscribe(event => {
      switch (event.type) {
        case StateUpdateType.Add:
          if (this.timer) { clearTimeout(this.timer); }
          if (event.data.status === UserStatus.Online) {
            this.timer = setTimeout(() => {
              this.userAvatarStateService.createUserStatusReportLog(UserStatus.Offline);
            }, 900000);
          }
          this._userAvatarService.addUserStatusLog(event.data);
          break;
      }
      this._cdr.detectChanges();
    });
    this._userAvatarService.setUserStatusLogs(this.userAvatarStateService.getUserStatusLog());
  }
}
