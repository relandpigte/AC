import { ChangeDetectorRef, Component, Injector } from '@angular/core';
import { ThemeManagerService } from '@shared/services/theme-manager.service';
import { BaseNavigation } from '../base-navigation';

@Component({
  selector: 'topnav',
  templateUrl: './topnav.component.html',
})
export class TopnavComponent extends BaseNavigation {
  constructor(injector: Injector, themeSettingsService: ThemeManagerService, cd: ChangeDetectorRef) {
    super(injector, themeSettingsService, cd);
  }
}
