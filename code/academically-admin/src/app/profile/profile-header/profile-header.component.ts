import { DOCUMENT } from '@angular/common';
import { Component, Inject, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { NavigationPosition } from '@shared/enums/theme-settings/navigation-position.enum';
import { IThemeSettings } from '@shared/models/theme-settings/theme-settings.interface';
import { GetProfileDetailDto } from '@shared/service-proxies/service-proxies';
import { ProfileService } from '@shared/services/profile.service';
import { ThemeManagerService } from '@shared/services/theme-manager.service';

@Component({
  selector: 'app-profile-header',
  templateUrl: './profile-header.component.html',
  styleUrls: ['./profile-header.component.less'],
})
export class ProfileHeaderComponent extends AppComponentBase implements OnInit {
  profileDetail: GetProfileDetailDto = new GetProfileDetailDto();
  NavigationPosition = NavigationPosition;
  themeSettings: IThemeSettings;
  isViewOnly = false;

  constructor(
    injector: Injector,
    themeSettingsService: ThemeManagerService,
    @Inject(DOCUMENT) private _document: Document,
    private _profileServie: ProfileService,
  ) {
    super(injector);
    this.themeSettings = themeSettingsService.getConfiguration();
  }

  ngOnInit(): void {
    this._profileServie.$profile.subscribe((profile) => {
      this.profileDetail = profile;
    });
    this._profileServie.$isViewOnly.subscribe((isViewOnly) => {
      setTimeout(() => {
        this.isViewOnly = isViewOnly;
      });
    });
  }

  onScrollClick(e: any, el: string): void {
    e.preventDefault();
    this._document.getElementById(el).scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}
