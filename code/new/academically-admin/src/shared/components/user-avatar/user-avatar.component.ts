import { Component, Injector, Input, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { UserDto, UserStatus } from '@shared/service-proxies/service-proxies';
import { UserAvatarService } from '@shared/services/user-avatar.service';
import { takeUntil } from 'rxjs/operators';

export const DEFAULT_AVATAR_WIDTH = 45;
export const DEFAULT_AVATAR_HEIGHT = 45;

@Component({
  selector: 'app-user-avatar',
  templateUrl: './user-avatar.component.html',
  styleUrls: ['./user-avatar.component.less']
})
export class UserAvatarComponent extends AppComponentBase implements OnInit {
  @Input() data: UserDto;
  @Input() width: number;
  @Input() height: number;
  @Input() showStatus = true;
  @Input() isBlocked: boolean;

  onlineUsers: UserDto[] = [];
  inactiveUsers: UserDto[] = [];

  constructor(
    injector: Injector,
    private _userAvatarService: UserAvatarService
  ) {
    super(injector);
  }

  get userFullName(): string { return this.data?.fullName; }
  get userProfilePicture(): string { return this.data?.profilePictureUrl; }
  get avatarWidth(): number { return this.width ?? DEFAULT_AVATAR_WIDTH; }
  get avatarHeight(): number { return this.height ?? DEFAULT_AVATAR_HEIGHT; }
  get avatarClassStatus(): string { return this.showStatus ? (this.isUserOnline ? 'avatar-online' : (this.isUserAway ? 'avatar-away' : 'avatar-offline')) : null; }
  get isUserOnline(): boolean { return this.onlineUsers?.some(u => u.id === this.data?.id); }
  get isUserAway(): boolean { return this.inactiveUsers?.some(u => u.id === this.data?.id); }

  ngOnInit(): void {
    this._userAvatarService.getUserStatusLog()
      .pipe(takeUntil(this.destroyed$))
      .subscribe(data => {
        this.onlineUsers = this._userAvatarService.getAllUserLogByStatus(UserStatus.Online, data);
        this.inactiveUsers = this._userAvatarService.getAllUserLogByStatus(UserStatus.Away, data);
      });
  }
}
