import { ChangeDetectorRef, Component, Injector } from '@angular/core';
import { BaseNavigation } from '@shared/models/base-navigation';
import { ThemeManagerService } from '@shared/services/theme-manager.service';

@Component({
  selector: 'topnav',
  templateUrl: './topnav.component.html',
})
export class TopnavComponent extends BaseNavigation {
  constructor(injector: Injector, themeSettingsService: ThemeManagerService, cd: ChangeDetectorRef) {
    super(injector, themeSettingsService, cd);
  }
}
