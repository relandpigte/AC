import { Component, Injector, Input, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';

import { AppComponentBase } from '@shared/app-component-base';
import { DocumentDto, UserDto, UserStatus } from '@shared/service-proxies/service-proxies';
import { UserAvatarService } from '@shared/services/user-avatar.service';

export const DEFAULT_AVATAR_WIDTH = 45;
export const DEFAULT_AVATAR_HEIGHT = 45;
export enum AvatarType {
  Default,
  NameAndStatus
}

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
  @Input() type: AvatarType = AvatarType.Default;
  @Input() isPrivateChat: boolean;
  @Input() isMutedChannel: boolean;

  onlineUsers: UserDto[] = [];
  inactiveUsers: UserDto[] = [];

  constructor(
    injector: Injector,
    private _userAvatarService: UserAvatarService
  ) {
    super(injector);
  }

  get isDefaultAvatar(): boolean { return this.type === AvatarType.Default; }
  get userFullName(): string { return this.data?.fullName; }
  get userProfilePicture(): string { return this.data?.profilePictureUrl ?? this.getProfilePictureUrl(this.data?.profilePictureDocument); }
  get avatarWidth(): number { return this.width ?? DEFAULT_AVATAR_WIDTH; }
  get avatarHeight(): number { return this.height ?? DEFAULT_AVATAR_HEIGHT; }
  get isUserOnline(): boolean { return this.onlineUsers?.some(u => u.id === this.data?.id); }

  ngOnInit(): void {
    this._userAvatarService.getUserStatusLog()
      .pipe(takeUntil(this.destroyed$))
      .subscribe(data => {
        this.onlineUsers = this._userAvatarService.getAllUserLogByStatus(UserStatus.Online, data);
        this.inactiveUsers = this._userAvatarService.getAllUserLogByStatus(UserStatus.Away, data);
      });
  }
}
