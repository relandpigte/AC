import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { IThemeSetting } from '@shared/interfaces/theme-setting.interface';
import { ColorScheme } from '@shared/enums/theme-settings/color-scheme.enum';
import { NavigationPosition } from '@shared/enums/theme-settings/navigation-position.enum';
import { SidebarSize } from '@shared/enums/theme-settings/sidebar-size.enum';
import { NavigationColor } from '@shared/enums/theme-settings/navigation-color.enum';
import { uiEvents } from '@shared/constants/ui-events.constant';

@Injectable({
  providedIn: 'root',
})
export class ThemeManagerService {
  configLsKeys = {
    colorScheme: 'colorScheme',
    navigationPosition: 'navigationPosition',
    sidenavSizing: 'sidenavSizing',
    navigationColor: 'navigationColor',
  };

  constructor(@Inject(DOCUMENT) private document: Document) { }

  public initializeLayout(): void {
    this.initColorScheme();
  }

  public getConfiguration(): IThemeSetting {
    const themeSettings: IThemeSetting = {
      colorScheme: this.getLocalStorageSetting(this.configLsKeys.colorScheme, ColorScheme.Light),
      navigationPosition: this.getLocalStorageSetting(this.configLsKeys.navigationPosition, NavigationPosition.Sidenav),
      sidenavSizing: this.getLocalStorageSetting(this.configLsKeys.sidenavSizing, SidebarSize.Base),
      navigationColor: this.getLocalStorageSetting(this.configLsKeys.navigationColor, NavigationColor.Default),
    };

    return themeSettings;
  }

  public saveConfiguration(themeSettings: IThemeSetting): void {
    const oldThemeSettings = this.getConfiguration();
    const sideNavSizing = themeSettings.navigationPosition === NavigationPosition.Topnav ? SidebarSize.Base : themeSettings.sidenavSizing;
    localStorage.setItem(this.configLsKeys.colorScheme, themeSettings.colorScheme);
    localStorage.setItem(this.configLsKeys.navigationPosition, themeSettings.navigationPosition);
    localStorage.setItem(this.configLsKeys.sidenavSizing, sideNavSizing);
    localStorage.setItem(this.configLsKeys.navigationColor, themeSettings.navigationColor);
    if (oldThemeSettings.colorScheme !== themeSettings.colorScheme) {
      this.initColorScheme();
    }
    abp.event.trigger(uiEvents.themeSettingsSaved);
  }

  private initColorScheme(): void {
    const colorSchemeElementId = 'theme-colorScheme';
    const colorSchemeSetting = this.getLocalStorageSetting(this.configLsKeys.colorScheme, ColorScheme.Light);
    const colorSchemeCssUrl = `/assets/themes/dashkit/css/${colorSchemeSetting}`;
    const head = this.document.getElementsByTagName('head')[0];
    let link = this.document.getElementById(colorSchemeElementId) as HTMLLinkElement;
    if (!link) {
      link = this.document.createElement('link');
      link.id = colorSchemeElementId;
      link.rel = 'stylesheet';
      link.type = 'text/css';
      link.href = colorSchemeCssUrl;
      link.media = 'all';
      head.appendChild(link);
    } else {
      link.href = colorSchemeCssUrl;
    }

    const body = this.document.getElementsByTagName('body')[0];
    const themeName = colorSchemeSetting.split('.')[0];
    body.classList.remove('theme');
    body.classList.remove('theme-dark');
    body.classList.add(themeName);
  }

  private getLocalStorageSetting(key: string, defaultValue?: string): string {
    let setting = localStorage.getItem(key);
    if (!setting) {
      setting = defaultValue;
    }
    return setting;
  }
}
