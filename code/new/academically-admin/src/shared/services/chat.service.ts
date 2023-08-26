import { Injectable } from '@angular/core';
import { AppSessionService } from '@shared/session/app-session.service';
import * as moment from 'moment';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

export interface ChatModel {
  id: string;
  referenceId?: number;
  message: string;
  creationTime: Date;
  creatorUserId: string;
  isSeen: Date;
  isDeleted?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  openChat$: Subject<any> = new Subject();

  private data: ChatModel[] = [
    {
      id: '1',
      referenceId: 555,
      message: 'This is the message that you like.',
      creationTime: new Date(moment.now()),
      creatorUserId: this._appSessionService.userId.toString(),
      isSeen: new Date(moment.now())
    },
    {
      id: '2',
      message: 'Yes, your example of defining an interface only for the particular items would be a more useful way to do it.',
      creationTime: new Date(moment.now()),
      creatorUserId: '123',
      isSeen: new Date(moment.now())
    },
    {
      id: '3',
      message: 'It would be quite rare to have an array of items, but not want to conveniently reference a single item.',
      creationTime: new Date(moment.now()),
      creatorUserId: this._appSessionService.userId.toString(),
      isSeen: new Date(moment.now())
    }
  ];
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
