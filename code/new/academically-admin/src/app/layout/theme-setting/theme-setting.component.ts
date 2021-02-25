import { Component, OnInit, ViewChild } from '@angular/core';
import { uiEvents } from '@shared/constants/ui-events.constant';
import { ColorScheme } from '@shared/enums/theme-settings/color-scheme.enum';
import { NavigationColor } from '@shared/enums/theme-settings/navigation-color.enum';
import { NavigationPosition } from '@shared/enums/theme-settings/navigation-position.enum';
import { SidebarSize } from '@shared/enums/theme-settings/sidebar-size.enum';
import { IThemeSetting } from '@shared/interfaces/theme-setting.interface';
import { ThemeManagerService } from '@shared/services/theme-manager.service';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'theme-setting',
  templateUrl: './theme-setting.component.html',
  styleUrls: ['./theme-setting.component.less']
})
export class ThemeSettingComponent implements OnInit {
  ColorScheme = ColorScheme;
  NavigationPosition = NavigationPosition;
  SidebarSize = SidebarSize;
  NavibationColor = NavigationColor;

  @ViewChild('themeSettingsModal') themeSettingsModal: ModalDirective;

  themeSettings: IThemeSetting;
  isLoading = false;

  constructor(private _themeManagerService: ThemeManagerService) {
    this.themeSettings = this._themeManagerService.getConfiguration();
  }

  ngOnInit(): void {
    abp.event.on(uiEvents.themeSettingsShow, () => {
      this.themeSettings = this._themeManagerService.getConfiguration();
      this.themeSettingsModal.show();
    });
  }

  onCloseClick(): void {
    this.close();
  }

  onColorSchemeChange(colorScheme: ColorScheme): void {
    if (this.themeSettings.colorScheme !== colorScheme) {
      this.themeSettings.colorScheme = colorScheme;
    }
  }

  onNavigationPositionChange(navigationPosition: NavigationPosition): void {
    if (this.themeSettings.navigationPosition !== navigationPosition) {
      this.themeSettings.navigationPosition = navigationPosition;
    }
  }

  onSidebarSizeChange(sidebarSize: SidebarSize): void {
    if (this.themeSettings.sidenavSizing !== sidebarSize) {
      this.themeSettings.sidenavSizing = sidebarSize;
    }
  }

  onNavigationColorChange(navigationColor: NavigationColor): void {
    if (this.themeSettings.navigationColor !== navigationColor) {
      this.themeSettings.navigationColor = navigationColor;
    }
  }

  onFormSubmit(): void {
    this.isLoading = true;
    this._themeManagerService.saveConfiguration(this.themeSettings);
    this.isLoading = false;
    this.close();
  }

  private close(): void {
    this.themeSettingsModal.hide();
  }
}
