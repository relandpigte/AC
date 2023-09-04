import { Component, Injector, OnInit, ElementRef, ViewChild, Input } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { NgForm } from '@angular/forms';
import { ChannelDto, UserDto, UserServiceProxy } from '@shared/service-proxies/service-proxies';
import { debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs/operators';
import { ChatService } from '@shared/services/chat.service';


@Component({
  selector: 'app-search-users',
  templateUrl: './search-users.component.html',
  styleUrls: ['./search-users.component.less']
})
export class SearchUsersComponent extends AppComponentBase implements OnInit {
  @ViewChild('searchInput', { static: true }) searchInput: ElementRef<HTMLInputElement>;
  @Input() channels: ChannelDto[];

  connectedUsers: UserDto[] = [];
  otherUsers: UserDto[] = [];

  constructor(
    injector: Injector,
    private _usersService: UserServiceProxy,
    private _chatService: ChatService
  ) {
    super(injector);
  }

  get isUserSearchResults(): boolean { return this.connectedUsers.length > 0 || this.otherUsers.length > 0; }
  get isOtherUsers(): boolean { return this.otherUsers.length > 0; }
  get isConnectedUsers(): boolean { return this.connectedUsers.length > 0; }

  ngOnInit(): void {
    this._chatService.searchKeyword$
      .pipe(
        takeUntil(this.destroyed$),
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(filter => this._usersService.searchUsersByName(filter, true, true, undefined, undefined, undefined))
      )
      .subscribe(result => {
        this.connectedUsers = result.item1;
        this.otherUsers = result.item2;
      });
  }

  handleSearchUsers(f: NgForm): void {
    this._chatService.searchKeyword$.next(f.value.search);
  }

  handleAddRecipient(user: UserDto): void {
    this._chatService.isSearchingUser$.next(false);
    const existingChannel = this.channels.find(c => c.members.some(e => e.userId === user.id));
    if (existingChannel) {
      this._chatService.selectedChannel$.next(existingChannel);
    } else {
      this._chatService.selectedChannel$.next(null);
      this._chatService.replyingToUser$.next(user);
    }
  }
}
