import { ChangeDetectorRef, Component, Injector, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import {
  AvailableServiceDto,
  ChannelDto,
  ChatsServiceProxy,
  CreateChannelInputDto,
  EventUsersResponseDto,
  PostsServiceProxy,
  UserDto,
  UserServiceProxy
} from '@shared/service-proxies/service-proxies';
import { distinctUntilChanged, skip, takeUntil } from 'rxjs/operators';
import { ChannelsStateService, channelsType } from '@shared/services/channels-state.service';
import { ChatService, NotificationType } from '@shared/services/chat.service';
import { AppStateConfig, AppStateServices } from '@shared/services/pub-sub.service';
import { HubService } from '@app/_shared/services/hub.service';
import { BehaviorSubject } from 'rxjs';
import { StateUpdateType } from '@shared/services/state-base.service';
import * as moment from 'moment';
import * as _ from 'lodash';
import { ElementRef } from '@node_modules/@angular/core';

@Component({
  selector: 'app-sidebar-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.less']
})
export class ChatComponent extends AppComponentBase implements OnInit {
  @Input() referenceId: string;

  @ViewChild('privateTab', { read: ElementRef }) privateTab: ElementRef<HTMLAnchorElement>;

  referenceService: AvailableServiceDto;
  channelsStateService: ChannelsStateService;

  channels: ChannelDto[] = [];
  privateChannels: ChannelDto[] = [];
  totalChannelsCount = 0;

  selectedChannelType = 0;
  selectedChannel: ChannelDto;

  isLoadingList$ = new BehaviorSubject<boolean>(true);

  joinedUsers: UserDto[] = [];
  notJoinedUsers: UserDto[] = [];
  replyingToUser: UserDto;
  toggleAttendee = false;
  searchUser: string;

  notificationType = NotificationType;
  mutedUserChannelIds: string[] = [];
  blockedUserIds: number[] = [];

  currentUserBlocker: number[] = [];

  constructor(
    injector: Injector,
    private _cdr: ChangeDetectorRef,
    private _hubService: HubService,
    private _postsService: PostsServiceProxy,
    private _chatService: ChatService,
    private _chatsService: ChatsServiceProxy,
    private _userService: UserServiceProxy,
    private _renderer: Renderer2
  ) {
    super(injector);

    this._chatService.selectedChannelType$
      .pipe(takeUntil(this.destroyed$))
      .pipe(skip(1))
      .subscribe(async selectedChannelType => {
        this.selectedChannelType = selectedChannelType;

        await this.channelsStateService.updateServiceParams({
          type: channelsType.reference,
          args: selectedChannelType === 0 ? [this.referenceId] : [this.referenceId, true]
        });

        this.channels = this.channelsStateService.getAllChannels();
        this.totalChannelsCount = this.channelsStateService.totalChannelsCount;
        this.privateChannels = this.channels?.filter(c => c.referenceId === null);
      });

    this._chatService.replyingToUser$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(user => {
        this.replyingToUser = user;
      });

    this._chatService.selectedChannel$
      .pipe(takeUntil(this.destroyed$))
      .pipe(skip(1))
      .subscribe(channel => {
        this.selectedChannel = channel;
        this._chatService.replyingToUser$.next(channel?.members?.find(m => m.userId !== this.appSession.userId)?.user);
      });

    this._chatService.deleteChannel$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(channel => this.handleOnDeleteChannel(channel));

    this._chatService.userTyping$
      .pipe(takeUntil(this.destroyed$))
      .pipe(distinctUntilChanged())
      .subscribe(isTyping => {
        if (this.selectedChannel) {
          this._chatsService.setChannelMemberTyping(this.selectedChannel.id, isTyping).pipe(takeUntil(this.destroyed$)).subscribe();
        }
      });
  }

  get channelsStateId(): string { return 'chats'; }
  get publicChannel(): ChannelDto { return this.selectedChannelType === 0 ? this.channels?.[0] : null; }
  get isUserBlocked(): boolean {
    const blockUser = this.selectedChannel?.members?.find(m => m.userId !== this.appSession.userId);
    return this.blockedUserIds?.includes(blockUser?.userId);
  }

  get isRecipientTyping(): boolean {
    const channel = this.channels.find(c => c.id === this.selectedChannel?.id);
    return channel?.members?.find(m => m.userId !== this.appSession.userId)?.isTyping ?? false;
  }

  async ngOnInit() {
    await this.getReferenceService();
    await this.initPublicChannel();
    await this.initChannelsAppStates();
    this.getEventUsers();
    this.getBlockedUsersIds();
    this.getCurrentUserBlockers();
  }

  handleAddRecipient(user: UserDto): void {
    const existingChannel = this.channels.find(c => c.members.some(e => e.userId === user.id));
    if (existingChannel) {
      this._chatService.selectedChannel$.next(existingChannel);
    } else {
      this._chatService.selectedChannel$.next(null);
      this._chatService.replyingToUser$.next(user);
    }
    this.toggleAttendee = false;
  }

  handleTabClick(channelType: number): void {
    this._chatService.selectedChannel$.next(null);
    this._chatService.selectedChannelType$.next(channelType);
    this.getAllMutedChannelByUser();
  }

  handleSelectChannel(channel: ChannelDto): void {
    this.selectedChannel = channel;
    this.getBlockedUsersIds();
    this.getCurrentUserBlockers();
  }

  handleBackToChannels(): void {
    setTimeout(() => this.privateTab.nativeElement.click());
    this.selectedChannel = null;
    this.replyingToUser = null;
  }

  handleOnDeleteChannel(channel: ChannelDto): void {
    this._chatsService.deleteChannel(channel.id).subscribe(() => {
      this._chatService.selectedChannelType$.next(this.selectedChannelType);
      this.handleBackToChannels();
    });
  }

  handleNotification(type: NotificationType): void {
    const channelId = this.selectedChannel?.id;
    const chatNotification = type === NotificationType.Mute ?
      this._chatsService.createChannelNotification(channelId) :
      this._chatsService.deleteChannelNotification(channelId);

    chatNotification.pipe(takeUntil(this.destroyed$))
      .subscribe((): void => {
        if (type === this.notificationType.Mute) {
          this.mutedUserChannelIds.push(channelId);
        } else {
          this.mutedUserChannelIds = this.mutedUserChannelIds.filter(mc => mc !== channelId);
        }
      });
  }

  handleBlockUser(): void {
    const blockUser = this.selectedChannel?.members?.find(m => m.userId !== this.appSession.userId);
    this._userService.blockUserById(blockUser?.userId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(user => {
        this.blockedUserIds.push(user.blockedUserId);
      });
  }

  handleUnBlockUser(): void {
    const blockUser = this.selectedChannel?.members?.find(m => m.userId !== this.appSession.userId);
    this._userService.unblockUserById(blockUser.userId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(result => {
        if (result) {
          this.blockedUserIds = this.blockedUserIds.filter(u => u !== blockUser.userId);
        }
      });
  }

  private getCurrentUserBlockers(): void {
    if (!this.selectedChannel) { return; }
    this.selectedChannel?.blockedByUsers?.map(user => {
      this.currentUserBlocker.push(user.creatorUserId);
    });
  }

  private getBlockedUsersIds(): void {
    if (!this.selectedChannel) { return; }

    this.selectedChannel?.blockedUsers?.map(user => {
      this.blockedUserIds.push(user.blockedUserId);
    });
  }

  private getAllMutedChannelByUser(): void {
    _.forEach(this.channels ?? [], (channel): void => {
      const notification = channel.channelNotifications?.filter(cn => cn.creatorUserId === this.appSession.userId);
      this.mutedUserChannelIds = _.union(this.mutedUserChannelIds, notification?.map(n => n.channelId));
    });
  }

  private async getReferenceService() {
    try {
      this.referenceService = await this._postsService.getService(this.referenceId).toPromise();
    } catch (err) {
      console.error(err);
    }
  }

  private async initPublicChannel() {
    try {
      await this._chatsService.createChannel(CreateChannelInputDto.fromJS({ referenceId: this.referenceId })).toPromise();
    } catch (err) {
      console.error(err);
    }
  }

  private async initChannelsAppStates() {
    const appStateConfig: AppStateConfig = {
      [this.channelsStateId]: {
        load: [this.referenceId],
        update: {}
      }
    };
    const appStateServices: AppStateServices = {
      [this.channelsStateId]: {
        type: ChannelsStateService,
        args: [channelsType.reference, this.appSession, this._hubService, this._chatsService]
      }
    };
    await this.pubSubService.start(this, appStateConfig, appStateServices, { typing: true });
    this.channelsStateService = this.pubSubService.getStateService<ChannelsStateService>(this.channelsStateId);
    this.channelsStateService.loading$.pipe(takeUntil(this.destroyed$)).subscribe(loading => this.isLoadingList$.next(loading));
    this.channelsStateService.channels$.pipe(takeUntil(this.destroyed$)).subscribe(event => {
      switch (event.type) {
        case StateUpdateType.Add:
          this.channels = [event.data].concat(this.channels);
          this.totalChannelsCount++;
          break;
        case StateUpdateType.Update:
          if (event.silent) {
            this.channels = this.channels.map(c => c.id === event.data.id ? event.data : c);
          } else {
            const idx = this.channels.findIndex(c => c.id === event.data.id);
            this.channels.splice(idx, 1);
            this.channels = [event.data].concat(this.channels);
          }
          break;
        case StateUpdateType.Delete:
          this.channels = this.channels.filter(c => c.id != event.data.id);
          this.totalChannelsCount--;
          break;
      }
      this._cdr.detectChanges();
    });
    this.channels = this.channelsStateService.getAllChannels();
    this.totalChannelsCount = this.channelsStateService.totalChannelsCount;
  }

  private getEventUsers(): void {
    this._chatsService.getEventUsers()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((users: EventUsersResponseDto): void => {
        this.joinedUsers = users.joined;
        this.notJoinedUsers = users.notJoined;
      });
  }
}
