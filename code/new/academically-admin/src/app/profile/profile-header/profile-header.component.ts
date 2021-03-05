import { Component, Injector, OnDestroy } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { NavigationPosition } from '@shared/enums/theme-settings/navigation-position.enum';
import { IThemeSetting } from '@shared/interfaces/theme-setting.interface';
import { UserDto } from '@shared/service-proxies/service-proxies';
import { ProfileService } from '@shared/services/profile.service';
import { ThemeManagerService } from '@shared/services/theme-manager.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile-header',
  templateUrl: './profile-header.component.html',
  styleUrls: ['./profile-header.component.less']
})
export class ProfileHeaderComponent extends AppComponentBase implements OnDestroy {
  NavigationPosition = NavigationPosition;
  themeSettings: IThemeSetting;
  user: UserDto;
  userTitle = '';
  userSubscription: Subscription;

  constructor(
    injector: Injector,
    themeSettingsService: ThemeManagerService,
    private _profileService: ProfileService,
  ) {
    super(injector);
    this.themeSettings = themeSettingsService.getConfiguration();
    this.userSubscription = this._profileService.$user.subscribe(user => {
      this.user = user;
      this.userTitle = this.user.roleNames.filter(e => e.toLowerCase() === 'tutor').length > 0 ? 'Tutor' : 'Profile';
    });
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }
}
