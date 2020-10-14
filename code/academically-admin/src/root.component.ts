import { Component } from '@angular/core';
import { ThemeManagerService } from './shared/services/theme-manager.service';

@Component({
  selector: 'app-root',
  template: `<router-outlet></router-outlet>`,
})
export class RootComponent {
  constructor(_themeManagerService: ThemeManagerService) {
    _themeManagerService.initializeLayout();
  }
}
