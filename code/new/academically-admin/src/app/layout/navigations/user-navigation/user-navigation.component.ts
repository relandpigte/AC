import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { AppAuthService } from '@shared/auth/app-auth.service';
import { UserAvatarService } from '@shared/services/user-avatar.service';
import { UserStatus } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'user-navigation',
  templateUrl: './user-navigation.component.html',
  styleUrls: ['./user-navigation.component.less'],
})
export class UserNavigationComponent extends AppComponentBase implements OnInit {
  constructor(injector: Injector, private _authService: AppAuthService, private _userAvatarService: UserAvatarService) {
    super(injector);
  }

  ngOnInit(): void {}

  onLogoutClick(): void {
    this._userAvatarService.createUserStatusReportLog(UserStatus.Offline);
    this._authService.logout();
  }
}
