import { ChangeDetectorRef, Injector, Input } from '@angular/core';
import { RouterEvent } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { uiEvents } from '@shared/constants/ui-events';
import { ColorScheme } from '@shared/enums/theme-settings/color-scheme.enum';
import { NavigationColor } from '@shared/enums/theme-settings/navigation-color.enum';
import { NavigationPosition } from '@shared/enums/theme-settings/navigation-position.enum';
import { SidebarSize } from '@shared/enums/theme-settings/sidebar-size.enum';
import { IThemeSettings } from '@shared/models/theme-settings/theme-settings.interface';
import { GetProfileDetailDto, UserLoginInfoDto } from '@shared/service-proxies/service-proxies';
import { ThemeManagerService } from '@shared/services/theme-manager.service';

export abstract class BaseNavigation extends AppComponentBase {
  @Input() routerEvent: RouterEvent;
  NavigationPosition = NavigationPosition;
  NavigationColor = NavigationColor;
  user: UserLoginInfoDto = new UserLoginInfoDto();
  themeSettings: IThemeSettings;
  navigationColor = '';
  appLogo = '';

  constructor(injector: Injector, themeSettingsService: ThemeManagerService, cd: ChangeDetectorRef) {
    super(injector);
    this.themeSettings = themeSettingsService.getConfiguration();
    this.initNavigationColor();
    this.user = this.appSession.user;
    abp.event.on(uiEvents.profileDetailsUpdated, (profile: GetProfileDetailDto, profilePictureUrl: string) => {
      this.user.profilePictureUrl = profilePictureUrl;
      cd.detectChanges();
    });
    abp.event.on(uiEvents.themeSettingsSaved, () => {
      this.themeSettings = themeSettingsService.getConfiguration();
      this.initNavigationColor();
      cd.detectChanges();
    });
  }

  onCustomizeClick(): void {
    abp.event.trigger(uiEvents.themeSettingsShow);
  }

  private initNavigationColor(): void {
    const lightNavigationColor = 'navbar-light';
    const darkNavigationColor = 'navbar-dark';
    const vibrantNavigationColor = 'navbar-dark navbar-vibrant';
    if (this.themeSettings.navigationColor === NavigationColor.Default) {
      this.navigationColor = ColorScheme.Light ? lightNavigationColor : darkNavigationColor;
    } else if (this.themeSettings.navigationColor === NavigationColor.Inverted) {
      this.navigationColor = ColorScheme.Light ? darkNavigationColor : lightNavigationColor;
    } else {
      this.navigationColor = vibrantNavigationColor;
    }
    const lightLogo = this.themeSettings.sidenavSizing === SidebarSize.Small ? 'ac-logo-light' : 'ac-full-logo-light';
    const darkLogo = this.themeSettings.sidenavSizing === SidebarSize.Small ? 'ac-logo-dark' : 'ac-full-logo-dark';
    this.appLogo = this.themeSettings.colorScheme === ColorScheme.Light ? lightLogo : darkLogo;
  }
}
