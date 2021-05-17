import { Component, Injector } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProfileService } from '@app/profile/_services/profile.service';
import { AppComponentBase } from '@shared/app-component-base';
import { uiEvents } from '@shared/constants/ui-events.constant';
import { NavigationPosition } from '@shared/enums/theme-settings/navigation-position.enum';
import { IThemeSetting } from '@shared/interfaces/theme-setting.interface';
import { UserDto } from '@shared/service-proxies/service-proxies';
import { ThemeManagerService } from '@shared/services/theme-manager.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent extends AppComponentBase {
  NavigationPosition = NavigationPosition;
  themeSettings: IThemeSetting;
  user: UserDto;
  userTitle = '';
  isViewOnly = false;

  constructor(
    injector: Injector,
    route: ActivatedRoute,
    themeSettingsService: ThemeManagerService,
    private _profileService: ProfileService,
  ) {
    super(injector);
    this.themeSettings = themeSettingsService.getConfiguration();
    this._profileService.user$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(user => {
        this.user = user;
        this.userTitle = this.user.roleNames.filter(e => e.toLowerCase() === 'tutor').length > 0 ? 'Tutor' : 'Student';
      });
    route.data.subscribe(data => {
      this.isViewOnly = data.isViewOnly;
    });
  }

  onProfilePictureUpdated(profilePictureUrl: string): void {
    this.user.profilePictureUrl = profilePictureUrl;
    this._profileService.user = this.user;
    abp.event.trigger(uiEvents.profileDetailsUpdated, profilePictureUrl);
  }
}
