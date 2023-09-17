import { Component, Injector, OnInit } from '@angular/core';

import { AppComponentBase } from '@shared/app-component-base';
import { EventCategory, EventDto, UserDto } from '@shared/service-proxies/service-proxies';
import { NavigationPosition } from '@shared/enums/theme-settings/navigation-position.enum';
import { IThemeSetting } from '@shared/interfaces/theme-setting.interface';
import { ThemeManagerService } from '@shared/services/theme-manager.service';
import { ShimmerType } from '@shared/enums/shimmer/shimmer-type.enum';
import { LandingPagesService } from '@shared/services/landing-pages.service';
import { ServiceDataService } from '@shared/services/service-data.service';
import { takeUntil } from '@node_modules/rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent extends AppComponentBase implements OnInit {
  user: UserDto;
  data: EventDto;
  themeSettings: IThemeSetting;
  NavigationPosition = NavigationPosition;

  shimmerType = ShimmerType;

  constructor(
    injector: Injector,
    _themeSettingsService: ThemeManagerService,
    private _landingPageService: LandingPagesService,
    private _serviceData: ServiceDataService
  ) {
    super(injector);
    this.themeSettings = _themeSettingsService.getConfiguration();
  }

  get profilePictureUrl(): string { return this.appSession.user.profilePictureUrl; }
  get profileFullName(): string { return `${this.appSession.user.name} ${this.appSession.user.surname}`; }
  get profileCoverPhotoUrl(): string { return this.appSession.user.coverPictureUrl; }
  get isLoading$() { return this._landingPageService.isLoading$; }
  get eventTitle(): string { return this.data?.name; }
  get eventCategoryName(): string { return this.data?.category === EventCategory.Broadcast ? 'Broadcast' : 'Workshop'; }

  ngOnInit(): void {
    this._serviceData.serviceData$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(data => this.data = data);
  }

  protected readonly name = name;
}
