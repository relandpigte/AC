import { Component, ChangeDetectionStrategy, Injector, ChangeDetectorRef } from '@angular/core';
import { ThemeManagerService } from '@shared/services/theme-manager.service';
import { BaseNavigation } from '../base-navigation';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent extends BaseNavigation {
  constructor(injector: Injector, themeSettingsService: ThemeManagerService, cd: ChangeDetectorRef) {
    super(injector, themeSettingsService, cd);
  }
}
