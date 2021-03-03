import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { NavigationPosition } from '@shared/enums/theme-settings/navigation-position.enum';
import { IThemeSetting } from '@shared/interfaces/theme-setting.interface';
import { ThemeManagerService } from '@shared/services/theme-manager.service';

@Component({
  selector: 'app-profile-header',
  templateUrl: './profile-header.component.html',
  styleUrls: ['./profile-header.component.less']
})
export class ProfileHeaderComponent extends AppComponentBase implements OnInit {
  NavigationPosition = NavigationPosition;
  themeSettings: IThemeSetting;

  constructor(
    injector: Injector,
    themeSettingsService: ThemeManagerService,
  ) {
    super(injector);
    this.themeSettings = themeSettingsService.getConfiguration();
  }

  ngOnInit(): void {
  }

}
