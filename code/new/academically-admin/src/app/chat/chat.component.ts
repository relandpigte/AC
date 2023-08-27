import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ChannelModel, ChatModel, ChatService } from '@shared/services/chat.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.less']
})
export class ChatComponent extends AppComponentBase implements OnInit {
  replyingTo: ChatModel;

  channels: ChannelModel[] = [];
  selectedChannel: number = 0;

  constructor(
    injector: Injector,
    private _chatService: ChatService
  ) {
    super(injector);

    this._chatService.replyToMessage$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(replyingTo => this.replyingTo = replyingTo);

    this._chatService.selectedChannel$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(selectedChannel => this.selectedChannel = selectedChannel);

    this._chatService.archiveChannel$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(channel => this.handleOnArchiveChannel(channel));
  }

  get isConversationEmpty(): boolean { return false; }
  get isMessageEmpty(): boolean { return false; }

  get inboxChannels() { return this.channels.filter(c => !c.isArchived && !c.isDeleted); }
  get archivedChannels() { return this.channels.filter(c => c.isArchived && !c.isDeleted); }

  ngOnInit(): void {
    this.initChannels();
  }

  private initChannels(): void {
    this.channels = [
      { id: '1', latestMessage: 'Test message 001...', creatorUser: { id: '1', fullName: 'Roger Reeves' }, isActive: true },
      { id: '2', latestMessage: 'Test message 001...', creatorUser: { id: '2', fullName: 'Casey Fyfe' } },
      { id: '3', latestMessage: 'Test message 001...', creatorUser: { id: '3', fullName: 'Sharon Peters' }, isArchived: true },
      { id: '4', latestMessage: 'Test message 001...', creatorUser: { id: '4', fullName: 'Macey Williams' } },
      { id: '5', latestMessage: 'Test message 001...', creatorUser: { id: '5', fullName: 'Robert Specks' } },
      { id: '6', latestMessage: 'Test message 001...', creatorUser: { id: '6', fullName: 'Sam Mewton' }, isArchived: true },
      { id: '7', latestMessage: 'Test message 001...', creatorUser: { id: '7', fullName: 'Shubert Hobbs' } },
      { id: '8', latestMessage: 'Test message 001...', creatorUser: { id: '8', fullName: 'Michelle Storks' } },
      { id: '9', latestMessage: 'Test message 001...', creatorUser: { id: '9', fullName: 'Stewart Bobson' } },
      { id: '10', latestMessage: 'Test message 001...', creatorUser: { id: '10', fullName: 'Albert Eiffel' }, isArchived: true }
    ];
  }

  handleOnReply(): void {
    console.log('this triggered!');
  }

  handleOnArchiveChannel(channel: ChannelModel): void {
    console.log('archive this: ', channel);
  }
}
