import { ChangeDetectorRef, Component, Injector, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ChannelDto, ChannelMessageDto,  UserDto, UserServiceProxy, UserStatus } from '@shared/service-proxies/service-proxies';
import * as _ from 'lodash';
import { AppStateConfig, AppStateServices } from '@shared/services/pub-sub.service';
import { UserAvatarStateService } from '@shared/services/user-avatar-state.service';
import { takeUntil } from '@node_modules/rxjs/operators';
import { StateUpdateType } from '@shared/services/state-base.service';
import { UserAvatarService } from '@shared/services/user-avatar.service';
import { HubService } from '@app/_shared/services/hub.service';
import * as moment from 'moment';
import { Moment } from '@node_modules/moment';

export enum ChatStatus {
  unread = 'unread',
  seen = 'seen',
  unseen = 'unseen'
}

@Component({
  selector: 'app-chat-recipient',
  templateUrl: './chat-recipient.component.html',
  styleUrls: ['./chat-recipient.component.less']
})
export class ChatRecipientComponent extends AppComponentBase implements OnChanges, OnInit, OnDestroy {
  @Input() channel: ChannelDto;
  @Input() isActive = false;
  @Input() blockedByUser: number[];
  @Input() mutedUserChannelIds: string[];

  userAvatarStateService: UserAvatarStateService;
  latestMessage: ChannelMessageDto;
  receivedDateStr: string;
  chatStatusClass = ChatStatus.seen;
  unreadCount = 0;
  channelName: string;

  private timer: any;

  constructor(
    injector: Injector,
    private _userService: UserServiceProxy,
    private _userAvatarService: UserAvatarService,
    private _hubService: HubService,
    private _cdr: ChangeDetectorRef
  ) {
    super(injector);
  }

  get loggedInUserStateId(): string { return 'onlineUsers'; }
  get isMutedChannel() { return this.mutedUserChannelIds?.includes(this.channel?.id); }
  get isRecipientTyping(): boolean {
    return this.channel?.members?.find(m => m.userId !== this.appSession.userId)?.isTyping ?? false;
  }
  get recipientUser(): UserDto {
    return this.channel?.members?.find(m => m.userId !== this.appSession.userId)?.user;
  }
  get isBlockedByRecipient(): boolean {
    const blockByRecipient = this.channel?.members.find(m => m.userId !== this.appSession.userId);
    return this.blockedByUser?.includes(blockByRecipient?.userId);
  }

  async ngOnInit(): Promise<void> {
    await this.initUserAvatarAppState();
  }

  async ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer); // Clean up the timer when the component is destroyed
    }

    await this.userAvatarStateService?.stop();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('channel' in changes) {
      this.initChannelFields();
    }
  }

  private initChannelFields(): void {
    this.setLatestMessage();
    this.setReceivedDateStr();
    this.setChatStatusClass();
    this.setChannelName();
  }

  private setLatestMessage(): void {
    if (this.channel?.messages) {
      this.latestMessage = _.maxBy(this.channel?.messages, m => m.creationTime);
    }
  }

  private setReceivedDateStr(): void {
    if (this.latestMessage) {
      this.receivedDateStr = this.convertMomentToChatChannelTime(this.latestMessage.creationTime);
    }
  }

  private setChatStatusClass(): void {
    this.chatStatusClass = ChatStatus.seen;
    if (this.latestMessage?.creatorUserId === this.appSession.userId) {
      if (!this.latestMessage.isSeen) {
        this.chatStatusClass = ChatStatus.unseen;
      }
    } else {
      this.unreadCount = this.channel?.messages?.filter(m => !m.isSeen && m.creatorUserId !== this.appSession.userId)?.length ?? 0;
      if (this.unreadCount > 0) {
        this.chatStatusClass = ChatStatus.unread;
      }
    }
  }

  private setChannelName(): void {
    this.channelName = this.channel?.members?.filter(m => m.userId !== this.appSession.userId)?.[0]?.user?.fullName ?? 'Unknown User';
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
          // TODO: We might need this later when Andrew change his mind
          // if (this.timer) { clearTimeout(this.timer); }
          // if (event.data.status === UserStatus.Online) {
          //   this.timer = setTimeout(() => {
          //     this.userAvatarStateService.createUserStatusReportLog(UserStatus.Away);
          //   }, 15000); // TODO: 15 seconds user status change for testing purposes.
          // }
          // TODO: Not sure if we need this
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
