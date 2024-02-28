import { Component, Injector, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ChannelDto, ChannelMessageDto, UserDto } from '@shared/service-proxies/service-proxies';
import * as _ from 'lodash';

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
export class ChatRecipientComponent extends AppComponentBase implements OnChanges {
  @Input() channel: ChannelDto;
  @Input() isActive = false;
  @Input() blockedByUser: number[];
  @Input() mutedUserChannelIds: string[];

  latestMessage: ChannelMessageDto;
  receivedDateStr: string;
  chatStatusClass = ChatStatus.seen;
  unreadCount = 0;
  channelName: string;

  constructor(
    injector: Injector
  ) {
    super(injector);
  }

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
}
