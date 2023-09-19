import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { SafeUrl } from '@angular/platform-browser';

import { AvailableServiceDto, ChannelDto, ChannelMessageDto, MatchedChannelDto, UserDto } from '@shared/service-proxies/service-proxies';

export enum NotificationType {
  Mute = 'Mute',
  Unmute = 'Unmute'
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  selectedChannelType$: BehaviorSubject<number> = new BehaviorSubject(0);
  openChat$: Subject<any> = new Subject();
  replyToMessage$: Subject<ChannelMessageDto> = new Subject();
  deleteChannel$: Subject<ChannelDto> = new Subject();
  archiveChannel$: Subject<ChannelDto> = new Subject();
  userTyping$: Subject<boolean> = new Subject();

  searchUser$: Subject<string> = new Subject<string>();
  replyingToUser$: BehaviorSubject<UserDto> = new BehaviorSubject<UserDto>(null);

  searchKeyword$: Subject<string> = new Subject<string>();
  selectedMatchedChannel$: BehaviorSubject<MatchedChannelDto> = new BehaviorSubject<MatchedChannelDto>(null);
  selectedMatchedCount$: BehaviorSubject<number> = new BehaviorSubject<number>(1);

  isSearchingUser$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  selectedChannel$: BehaviorSubject<ChannelDto> = new BehaviorSubject<ChannelDto>(null);

  selectedService$: BehaviorSubject<AvailableServiceDto> = new BehaviorSubject<AvailableServiceDto>(null);

  constructor() {
  }
}
