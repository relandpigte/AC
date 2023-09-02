import { ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { HubService } from '@app/_shared/services/hub.service';
import { AppComponentBase } from '@shared/app-component-base';
import { ChannelDto, ChatsServiceProxy } from '@shared/service-proxies/service-proxies';
import { ChannelsStateService, channelsType } from '@shared/services/channels-state.service';
import { ChatModel, ChatService } from '@shared/services/chat.service';
import { AppStateConfig, AppStateServices } from '@shared/services/pub-sub.service';
import { StateUpdateType } from '@shared/services/state-base.service';
import { BehaviorSubject, combineLatest, of } from 'rxjs';
import { skip, switchMap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.less']
})
export class ChatComponent extends AppComponentBase implements OnInit {
  channelsStateService: ChannelsStateService;

  replyingTo: ChatModel;

  channels: ChannelDto[] = [];
  totalChannelsCount = 0;

  selectedChannelType;
  selectedChannel: ChannelDto;

  isLoadingList$ = new BehaviorSubject<boolean>(true);

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
        this.selectedChannel = this.channels?.[0];
      });

    this._chatService.archiveChannel$
      .pipe(takeUntil(this.destroyed$))
      .pipe(skip(1))
      .subscribe(channel => this.handleOnArchiveChannel(channel));

    this._chatService.deleteChannel$
      .pipe(takeUntil(this.destroyed$))
      .pipe(skip(1))
      .subscribe(channel => this.handleOnDeleteChannel(channel));
  }

  get channelsStateId(): string { return 'chats'; }

  get isLoading$() { return combineLatest(this.loadingSources$).pipe(switchMap((loaders) => of(loaders.some(l => l)))); }
  get loadingSources$() { return [ this.isLoadingList$ ]; }

  get isConversationEmpty(): boolean { return !this.channels?.length; }
  get isMessageEmpty(): boolean { return !this.selectedChannel?.messages?.length; }

  get inboxChannels() { return this.channels.filter(c => !c.isArchive && !c.isDeleted); }
  get archivedChannels() { return this.channels.filter(c => c.isArchive && !c.isDeleted); }
  get listHeader(): string {
    if (this.selectedChannelType === 1) return 'Archived';
    return null;
  }

  async ngOnInit() {
    await this.initChannelsAppStates();
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
              this.channels = this.channels.map(c => c.id === event.data.id ? event.data : c);
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
    this.selectedChannel = this.channels?.[0];
  }

  switchToInbox(): void {
    this._chatService.selectedChannelType$.next(0);
  }

  handleOnChannelSelect(channel: ChannelDto) {
    this.selectedChannel = channel;
  }

  handleOnReply(): void {
    console.log('this triggered!');
  }

  handleOnArchiveChannel(channel: ChannelDto): void {
    console.log('archive this: ', channel);
  }

  handleOnDeleteChannel(channel: ChannelDto): void {
    console.log('delete this: ', channel);
  }
}
