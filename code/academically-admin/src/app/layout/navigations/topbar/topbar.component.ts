import { ChangeDetectorRef, Component, Injector } from '@angular/core';
import { ThemeManagerService } from '@shared/services/theme-manager.service';
import { BaseNavigation } from '../base-navigation';

@Component({
  selector: 'topbar',
  templateUrl: './topbar.component.html',
})
export class TopbarComponent extends BaseNavigation {
  constructor(injector: Injector, themeSettingsService: ThemeManagerService, cd: ChangeDetectorRef) {
    super(injector, themeSettingsService, cd);
  }
}
