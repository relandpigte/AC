import { ChangeDetectorRef, Component, Injector, OnInit, ViewChild } from '@angular/core';
import { HubService } from '@app/_shared/services/hub.service';
import { SearchUsersComponent } from '@app/chat/_components/search-users/search-users.component';
import { AppComponentBase } from '@shared/app-component-base';
import {
  AvailableServiceDto,
  ChannelDto,
  ChannelMessageDto,
  ChatsServiceProxy,
  MatchedChannelDto,
  UserDto
} from '@shared/service-proxies/service-proxies';
import { ChannelsStateService, channelsType } from '@shared/services/channels-state.service';
import { ChatService } from '@shared/services/chat.service';
import { AppStateConfig, AppStateServices } from '@shared/services/pub-sub.service';
import { StateUpdateType } from '@shared/services/state-base.service';
import { BehaviorSubject, combineLatest, of } from 'rxjs';
import { distinctUntilChanged, skip, switchMap, takeUntil } from 'rxjs/operators';
import { SearchFilterComponent } from './_components/search-filter/search-filter.component';
import { ComposerConversationComponent } from './_components/composer-conversation/composer-conversation.component';
import { FileUtils } from '@shared/helpers/file-utils';

export interface MessageComposeData {
  parentId?: string;
  message: string;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.less']
})
export class ChatComponent extends AppComponentBase implements OnInit {
  channelsStateService: ChannelsStateService;

  replyingTo: ChannelMessageDto;

  channels: ChannelDto[] = [];
  totalChannelsCount = 0;

  selectedChannelType = 0;
  selectedChannel: ChannelDto;

  isLoadingList$ = new BehaviorSubject<boolean>(true);

  isSearchingUser: boolean;
  isSearchingKeyword: boolean;
  replyingToUser: UserDto;
  fileAttachment: File;
  selectedService: AvailableServiceDto;

  @ViewChild(SearchUsersComponent) searchUsersComponent: SearchUsersComponent;
  @ViewChild(SearchFilterComponent) searchFilterComponent: SearchFilterComponent;
  @ViewChild(ComposerConversationComponent) composerConversationComponent: ComposerConversationComponent;

  constructor(
    injector: Injector,
    private _cdr: ChangeDetectorRef,
    private _chatService: ChatService,
    private _hubService: HubService,
    private _chatsService: ChatsServiceProxy,
  ) {
    super(injector);

    this._chatService.replyToMessage$
      .pipe(takeUntil(this.destroyed$))
      .pipe(skip(1))
      .subscribe(replyingTo => this.replyingTo = replyingTo);

    this._chatService.selectedChannelType$
      .pipe(takeUntil(this.destroyed$))
      .pipe(skip(1))
      .subscribe(async selectedChannelType => {
        this.selectedChannelType = selectedChannelType;

        await this.channelsStateService.updateServiceParams({
          type: selectedChannelType === 0 ? channelsType.inbox : channelsType.archived,
          userId: this.appSession.userId
        });

        this.channels = this.channelsStateService.getAllChannels();
        this.totalChannelsCount = this.channelsStateService.totalChannelsCount;
        this._chatService.selectedChannel$.next(this.channels?.[0]);
      });

    this._chatService.archiveChannel$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(channel => this.handleOnArchiveChannel(channel));

    this._chatService.deleteChannel$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(channel => this.handleOnDeleteChannel(channel));

    this._chatService.replyingToUser$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(user => this.replyingToUser = user);

    this._chatService.selectedChannel$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(channel => {
        this.selectedChannel = channel;
        this._chatService.replyingToUser$.next(channel?.members?.find(m => m.userId !== this.appSession.userId)?.user);
      });

    this._chatService.isSearchingUser$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(searching => this.isSearchingUser = searching);

    this._chatService.searchKeyword$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(keyword => {
        this.isSearchingKeyword = !!keyword;
        if (!this.isSearchingKeyword) this._chatService.selectedMatchedChannel$.next(null);
      });

    this._chatService.userTyping$
      .pipe(takeUntil(this.destroyed$))
      .pipe(distinctUntilChanged())
      .subscribe(isTyping => {
        if (this.selectedChannel) {
          this._chatsService.setChannelMemberTyping(this.selectedChannel.id, isTyping).pipe(takeUntil(this.destroyed$)).subscribe();
        }
      });

    this._chatService.fileAttachment$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(file => this.fileAttachment = file);

    this._chatService.selectedService$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(service => this.selectedService = service);
  }

  get channelsStateId(): string { return 'chats'; }

  get isLoading$() { return combineLatest(this.loadingSources$).pipe(switchMap((loaders) => of(loaders.some(l => l)))); }
  get loadingSources$() { return [ this.isLoadingList$ ]; }

  get isConversationEmpty(): boolean { return !this.channels?.length; }
  get isMessageEmpty(): boolean { return  !this.selectedChannel?.messages?.length; }

  get listHeader(): string {
    if (this.selectedChannelType === 1) return 'Archived';
    return null;
  }

  get isRecipientTyping(): boolean {
    const channel = this.channels.find(c => c.id === this.selectedChannel?.id);
    return channel?.members?.find(m => m.userId !== this.appSession.userId)?.isTyping ?? false;
  }

  async ngOnInit() {
    await this.initChannelsAppStates();
  }

  handleOnComposeMessage(): void {
    this._chatService.isSearchingUser$.next(true);
    this.searchUsersComponent?.searchInput.nativeElement.focus();
  }

  private async initChannelsAppStates() {
    const appStateConfig: AppStateConfig = {
        [this.channelsStateId]: {
            load: [this.appSession.userId],
            update: {}
        }
    };
    const appStateServices: AppStateServices = {
        [this.channelsStateId]: {
            type: ChannelsStateService,
            args: [this._hubService, this._chatsService]
        }
    };
    await this.pubSubService.start(this, appStateConfig, appStateServices);
    this.channelsStateService = this.pubSubService.getStateService<ChannelsStateService>(this.channelsStateId);
    this.channelsStateService.loading$.pipe(takeUntil(this.destroyed$)).subscribe(loading => this.isLoadingList$.next(loading));
    this.channelsStateService.channels$.pipe(takeUntil(this.destroyed$)).subscribe(event => {
        switch(event.type) {
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
    this._chatService.selectedChannel$.next(this.channels?.[0]);
  }

  // tslint:disable-next-line: member-ordering
  switchToInbox(): void {
    this._chatService.selectedChannelType$.next(0);
  }

  // tslint:disable-next-line: member-ordering
  handleOnChannelSelect(channel: ChannelDto) {
    this._chatService.selectedChannel$.next(channel);
    this._chatService.isSearchingUser$.next(false);
  }

  // tslint:disable-next-line: member-ordering
  handleOnReply(messageComposeData: MessageComposeData): void {
    this._chatsService.createChannelMessage(
      messageComposeData.message,
      this.replyingToUser?.id,
      this.selectedChannel?.id,
      messageComposeData.parentId,
      this.selectedService?.id,
      this.selectedService?.serviceType,
      [this.fileAttachment].filter(x => x).map(f => FileUtils.getFileParameter(f))
    )
      .subscribe((message): void => {
        this._chatService.replyToMessage$.next(null);
        this._chatService.fileAttachment$.next(null);
        this._chatService.selectedService$.next(null);
        this.selectedChannel = this.channels.find(c => c.id === message.channelId);
      });
  }

  // tslint:disable-next-line: member-ordering
  handleOnArchiveChannel(channel: ChannelDto): void {
    this._chatsService.archiveChannel(channel.id).subscribe(() => {
      this._chatService.selectedChannelType$.next(this.selectedChannelType);
    });
  }

  // tslint:disable-next-line: member-ordering
  handleOnDeleteChannel(channel: ChannelDto): void {
    this._chatsService.deleteChannel(channel.id).subscribe(() => {
      this._chatService.selectedChannelType$.next(this.selectedChannelType);
    });
  }

  // tslint:disable-next-line: member-ordering
  handleOnSelectSearchUser(user: UserDto): void {
    this.searchFilterComponent.clearSearchFilter();

    const channel = this.channels.find(c => c.members.some(m => m.userId === user.id));
    if (channel) this.handleOnChannelSelect(channel);
    else {
      this._chatService.selectedChannel$.next(null);
      setTimeout(() => this._chatService.replyingToUser$.next(user));
    }
  }

  handleOnSelectSearchChannel(matchedChannel: MatchedChannelDto): void {
    const channel = this.channels.find(c => c.id === matchedChannel.channel.id);
    if (channel) {
      this.handleOnChannelSelect(channel);
      this._chatService.selectedMatchedChannel$.next(matchedChannel);
    }
  }
}
