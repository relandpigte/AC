import { Component, Injector, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { USER_STATUS_STATE_ID } from '@app/app.component';

import { AppComponentBase } from '@shared/app-component-base';
import { UserDto } from '@shared/service-proxies/service-proxies';
import { UserAvatarStateService } from '@shared/services/user-avatar-state.service';
import { of } from 'rxjs';

import * as moment from 'moment';

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
export class UserAvatarComponent extends AppComponentBase implements OnInit, OnChanges {
  @Input() data: UserDto;
  @Input() width: number;
  @Input() height: number;
  @Input() showStatus = true;
  @Input() isBlocked: boolean;
  @Input() type: AvatarType = AvatarType.Default;
  @Input() isPrivateChat: boolean;
  @Input() isMutedChannel: boolean;

  private userAvatarStateService: UserAvatarStateService;

  constructor(
    injector: Injector,
  ) {
    super(injector);
  }

  get isDefaultAvatar(): boolean { return this.type === AvatarType.Default; }
  get userFullName(): string { return this.data?.fullName; }
  get userProfilePicture() { return this.data?.profilePictureUrl ? of(this.data?.profilePictureUrl) : this.getProfilePictureUrl(this.data?.profilePictureDocument); }
  get avatarWidth(): number { return this.width ?? DEFAULT_AVATAR_WIDTH; }
  get avatarHeight(): number { return this.height ?? DEFAULT_AVATAR_HEIGHT; }
  get isUserOnline(): boolean { return this.userAvatarStateService?.isUserOnline(this.data.id); }

  ngOnInit(): void {
    this.userAvatarStateService = this.pubSubService.getStateService<UserAvatarStateService>(USER_STATUS_STATE_ID);
  }

  ngOnChanges(changes: SimpleChanges): void {
      if ('data' in changes) {
        setTimeout(() => this.cdr.detectChanges());
      }
  }
}
