import { Injectable } from '@angular/core';
import { AppSessionService } from '@shared/session/app-session.service';
import * as moment from 'moment';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

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

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  selectedChannel$: BehaviorSubject<number> = new BehaviorSubject(0);
  openChat$: Subject<any> = new Subject();
  replyToMessage$: Subject<ChatModel> = new Subject();
  deleteChannel$: Subject<ChannelModel> = new Subject();
  archiveChannel$: Subject<ChannelModel> = new Subject();

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
      isSeen: new Date(moment.now()),
      parentMessage: {
        id: '1',
        referenceId: 555,
        message: 'This is the message that you like.',
        creationTime: new Date(moment.now()),
        creatorUserId: this._appSessionService.userId.toString(),
        isSeen: new Date(moment.now())
      }
    },
    {
      id: '3',
      message: 'It would be quite rare to have an array of items, but not want to conveniently reference a single item.',
      creationTime: new Date(moment.now()),
      creatorUserId: this._appSessionService.userId.toString(),
      isSeen: new Date(moment.now())
    },
    {
      id: '4',
      message: 'Phasellus egestas posuere lacinia. Vestibulum eget mi blandit, efficitur nisl at, tempor enim. Aenean vitae augue eget nisl semper gravida at ac justo. Maecenas sit amet massa sem. Nulla facilisi. Curabitur sodales id sem non euismod. Maecenas lacinia turpis sed magna ornare rutrum.',
      creationTime: new Date(moment.now()),
      creatorUserId: '123',
      isSeen: new Date(moment.now())
    },
    {
      id: '5',
      message: 'Nunc eu vestibulum lacus, eget viverra nisl. Nullam rhoncus aliquet sodales. Aenean faucibus, velit non ullamcorper placerat, risus nisl pharetra nisl, sed sodales neque justo pretium erat. Duis pretium elit eu nisl facilisis, id egestas lectus malesuada. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nam maximus sit amet metus ut lobortis. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum metus mi, tempor nec pharetra id, consectetur ut lectus. Curabitur faucibus orci id arcu vulputate mattis.',
      creationTime: new Date(moment.now()),
      creatorUserId: this._appSessionService.userId.toString(),
      isSeen: new Date(moment.now())
    },
    {
      id: '6',
      message: 'Quisque ultrices felis sem, et eleifend ex efficitur et. Proin ac risus sed ante suscipit consequat eu a sem. Nullam a nisl et metus facilisis elementum in sed leo. Nulla sollicitudin consequat est non eleifend. Phasellus a gravida nibh. Donec eu diam gravida, blandit libero ac, fringilla ante. Nulla dictum, metus eget egestas rutrum, tortor justo tempus ipsum, quis cursus velit lacus nec lacus. Phasellus tincidunt ornare semper. Suspendisse suscipit varius ligula et rhoncus. Integer vitae arcu ipsum. Donec id nunc ac urna vehicula porttitor. Cras efficitur sit amet purus ac tempor.',
      creationTime: new Date(moment.now()),
      creatorUserId: this._appSessionService.userId.toString(),
      isSeen: new Date(moment.now()),
      parentMessage: {
        id: '4',
        message: 'Phasellus egestas posuere lacinia. Vestibulum eget mi blandit, efficitur nisl at, tempor enim. Aenean vitae augue eget nisl semper gravida at ac justo. Maecenas sit amet massa sem. Nulla facilisi. Curabitur sodales id sem non euismod. Maecenas lacinia turpis sed magna ornare rutrum.',
        creationTime: new Date(moment.now()),
        creatorUserId: '123',
        isSeen: new Date(moment.now())
      },
    },
    {
      id: '7',
      message: 'Quisque in ligula in lacus mollis pretium vitae eu tortor. Sed nec velit accumsan, fringilla nisl non, molestie risus. Sed sed sagittis sem. Suspendisse non magna pharetra, fermentum leo id, venenatis arcu. Fusce lacinia in sapien a congue. Nam cursus interdum felis, id dictum sapien aliquam et. Cras ut nunc vel leo porta faucibus id aliquet ligula. Duis et ultrices lectus.',
      creationTime: new Date(moment.now()),
      creatorUserId: '123',
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
