import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { NavigationPosition } from '@shared/enums/theme-settings/navigation-position.enum';
import { IThemeSetting } from '@shared/interfaces/theme-setting.interface';
import { UserLoginInfoDto } from '@shared/service-proxies/service-proxies';
import { ThemeManagerService } from '@shared/services/theme-manager.service';

@Component({
  selector: 'app-profile-header',
  templateUrl: './profile-header.component.html',
  styleUrls: ['./profile-header.component.less']
})
export class ProfileHeaderComponent extends AppComponentBase implements OnInit {
  NavigationPosition = NavigationPosition;
  themeSettings: IThemeSetting;
  user: UserLoginInfoDto;
  userTitle = '';

  constructor(
    injector: Injector,
    themeSettingsService: ThemeManagerService,
  ) {
    super(injector);
    this.themeSettings = themeSettingsService.getConfiguration();
    this.user = this.appSession.user;
    this.userTitle = this.user.roles.filter(e => e.toLowerCase() === 'tutor').length > 0 ? 'Tutor' : 'Profile';
  }

  ngOnInit(): void {
  }

}
