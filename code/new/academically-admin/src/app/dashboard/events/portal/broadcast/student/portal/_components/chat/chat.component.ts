import { ChangeDetectorRef, Component, Injector, Input, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { MessageComposeData } from '@app/chat/chat.component';
import { AvailableServiceDto, ChannelDto, ChatsServiceProxy, EventUsersResponseDto, PostsServiceProxy, UserDto } from '@shared/service-proxies/service-proxies';
import { skip, takeUntil } from 'rxjs/operators';
import { ChannelsStateService, channelsType } from '@shared/services/channels-state.service';
import { ChatService } from '@shared/services/chat.service';
import { AppStateConfig, AppStateServices } from '@shared/services/pub-sub.service';
import { HubService } from '@app/_shared/services/hub.service';
import { BehaviorSubject } from 'rxjs';
import { StateUpdateType } from '@shared/services/state-base.service';
import * as moment from 'moment';

@Component({
  selector: 'app-sidebar-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.less']
})
export class ChatComponent extends AppComponentBase implements OnInit {
  @Input() referenceId: string;

  referenceService: AvailableServiceDto;

  channelsStateService: ChannelsStateService;

  channels: ChannelDto[] = [];
  totalChannelsCount = 0;

  selectedChannelType = 0;
  selectedChannel: ChannelDto;

  isLoadingList$ = new BehaviorSubject<boolean>(true);

  joinedUsers: UserDto[] = [];
  notJoinedUsers: UserDto[] = [];

  toggleAttendee = false;
  searchUser: string;

  constructor(
    injector: Injector,
    private _cdr: ChangeDetectorRef,
    private _hubService: HubService,
    private _postsService: PostsServiceProxy,
    private _chatService: ChatService,
    private _chatsService: ChatsServiceProxy
  ) {
    super(injector);

    this._chatService.selectedChannelType$
      .pipe(takeUntil(this.destroyed$))
      .pipe(skip(1))
      .subscribe(async selectedChannelType => {
        this.selectedChannelType = selectedChannelType;

        await this.channelsStateService.updateServiceParams({
          type: channelsType.reference,
          args: selectedChannelType === 0 ? [this.referenceId] : [this.referenceId, this.referenceServiceCreationTime]
        });

        this.channels = this.channelsStateService.getAllChannels();
        this.totalChannelsCount = this.channelsStateService.totalChannelsCount;
        this._chatService.selectedChannel$.next(this.channels?.[0]);
      });
  }

  get channelsStateId(): string { return 'chats'; }
  get referenceServiceCreationTime(): moment.Moment { return this.referenceService?.creationTime; }
  get publicChannel(): ChannelDto { return this.selectedChannelType === 0 ? this.channels?.[0] : null; }

  async ngOnInit() {
    await this.getReferenceService();
    await this.initChannelsAppStates();
    this.getEventUsers();
  }

  private async getReferenceService() {
    try {
      this.referenceService = await this._postsService.getService(this.referenceId).toPromise();
    } catch(err) {
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
    this._chatService.selectedChannel$.next(this.channels?.[0]);

    console.log(this.channels);
  }

  private getEventUsers(): void {
    this._chatsService.getEventUsers()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((users: EventUsersResponseDto): void => {
        this.joinedUsers = users.joined;
        this.notJoinedUsers = users.notJoined;
      });
  }

  handleTabClick(channelType: number): void {
    this._chatService.selectedChannelType$.next(channelType);
  }
}
