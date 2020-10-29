import { ChangeDetectorRef, Component, Injector } from '@angular/core';
import { ThemeManagerService } from '@shared/services/theme-manager.service';
import { BaseNavigation } from '../base-navigation';

@Component({
  selector: 'sidebar-small',
  templateUrl: './sidebar-small.component.html',
})
export class SidebarSmallComponent extends BaseNavigation {
  constructor(injector: Injector, themeSettingsService: ThemeManagerService, cd: ChangeDetectorRef) {
    super(injector, themeSettingsService, cd);
  }
}
