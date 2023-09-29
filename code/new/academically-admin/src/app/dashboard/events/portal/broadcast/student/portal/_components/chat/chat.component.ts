import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { MessageComposeData } from '@app/chat/chat.component';
import { ChatsServiceProxy, EventUsersResponseDto, UserDto } from '@shared/service-proxies/service-proxies';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.less']
})
export class ChatComponent extends AppComponentBase implements OnInit {
  joinedUsers: UserDto[] = [];
  notJoinedUsers: UserDto[] = [];

  toggleAttendee = false;
  searchUser: string;

  constructor(
    injector: Injector,
    private _chatsService: ChatsServiceProxy
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.getEventUsers();
  }

  private getEventUsers(): void {
    this._chatsService.getEventUsers()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((users: EventUsersResponseDto): void => {
        this.joinedUsers = users.joined;
        this.notJoinedUsers = users.notJoined;
      });
  }
}
