import { Component, Injector, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';

import { AppComponentBase } from '@shared/app-component-base';
import { UserDto, UserServiceProxy } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-blocking',
  templateUrl: './blocking.component.html',
  styleUrls: ['./blocking.component.less']
})
export class BlockingComponent extends AppComponentBase implements OnInit {
  users: UserDto[] = [];

  constructor(
    injector: Injector,
    private _userService: UserServiceProxy
  ) {
    super(injector);
  }

  get userCount(): number { return this.users?.length; }

  ngOnInit(): void {
    this.getBlockedUsers();
  }

  handleUnblockUser(userId: number): void {
    this._userService.unblockUserById(userId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(result => {
        if (result) {
          this.users = this.users.filter(x => x.id !== userId);
        }
      });
  }

  private getBlockedUsers(): void {
    this._userService.getBlockedUsers(this.currentUserId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(users => {
        this.users = users;
        console.warn(users);
      });
  }
}
