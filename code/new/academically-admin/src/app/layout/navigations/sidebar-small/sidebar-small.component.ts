import { ChangeDetectorRef, Component, Injector } from '@angular/core';
import { BaseNavigation } from '@shared/models/base-navigation';
import { ThemeManagerService } from '@shared/services/theme-manager.service';

@Component({
  selector: 'sidebar-small',
  templateUrl: './sidebar-small.component.html',
})
export class SidebarSmallComponent extends BaseNavigation {
  constructor(injector: Injector, themeSettingsService: ThemeManagerService, cd: ChangeDetectorRef) {
    super(injector, themeSettingsService, cd);
  }
}
