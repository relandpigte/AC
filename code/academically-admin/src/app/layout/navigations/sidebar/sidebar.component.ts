import { Component, ChangeDetectionStrategy, Injector, ChangeDetectorRef } from '@angular/core';
import { AppAuthService } from '@shared/auth/app-auth.service';
import { ThemeManagerService } from '@shared/services/theme-manager.service';
import { BaseNavigation } from '../base-navigation';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent extends BaseNavigation {
  constructor(injector: Injector, themeSettingsService: ThemeManagerService, cd: ChangeDetectorRef, authService: AppAuthService) {
    super(injector, themeSettingsService, cd, authService);
  }
}
