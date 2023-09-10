import { Injectable } from '@angular/core';
import { AvailableServiceDto, ChannelDto, ChannelMessageDto, UserDto } from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/session/app-session.service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { SafeUrl } from '@angular/platform-browser';

export interface ChannelModel {
  id: string,
  creatorUser?: any;
  latestMessage: string;
  creationTime?: Date;
  isArchived?: boolean;
  isDeleted?: boolean;
  isSeen?: Date;
  isActive?: boolean;
}

export interface ChatModel {
  id: string;
  referenceId?: number;
  message: string;
  creationTime: Date;
  creatorUser?: any;
  creatorUserId: string;
  isSeen: Date;
  isDeleted?: boolean;
  parentMessage?: ChatModel;
}

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

  replyingToUser$: BehaviorSubject<UserDto> = new BehaviorSubject<UserDto>(null);
  searchUser$: Subject<string> = new Subject<string>();
  searchKeyword$: Subject<string> = new Subject<string>();

  isSearchingUser$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  selectedChannel$: BehaviorSubject<ChannelDto> = new BehaviorSubject<ChannelDto>(null);

  fileAttachment$: BehaviorSubject<File> = new BehaviorSubject<File>(null);
  sanitizedAttachmentUrl$: BehaviorSubject<SafeUrl> = new BehaviorSubject<SafeUrl>(null);

  selectedService$: BehaviorSubject<AvailableServiceDto> = new BehaviorSubject<AvailableServiceDto>(null);

  private data: ChatModel[] = [];
  private dataSubject = new BehaviorSubject<ChatModel[]>(this.data);

  constructor(private _appSessionService: AppSessionService) {
  }

  getChatData(): Observable<ChatModel[]> {
    return this.dataSubject.asObservable();
  }

  addChatData(newItem: ChatModel): void {
    this.data.push(newItem);
    this.dataSubject.next(this.data);
  }

  removeChatData(chatId: string): void {
    const chatIndex = this.data.findIndex(c => c.id === chatId);
    this.data[chatIndex].isDeleted = true;

    this.dataSubject.next((this.data));
  }
}
