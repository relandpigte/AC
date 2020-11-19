import { Component, Injector, Input, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { uiEvents } from '@shared/constants/ui-events';
import { NavigationPosition } from '@shared/enums/theme-settings/navigation-position.enum';
import { SidebarSize } from '@shared/enums/theme-settings/sidebar-size.enum';
import { IThemeSettings } from '@shared/models/theme-settings/theme-settings.interface';
import { ThemeManagerService } from '@shared/services/theme-manager.service';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-wrapper',
  templateUrl: './wrapper.component.html',
  styleUrls: ['./wrapper.component.less'],
})
export class WrapperComponent extends AppComponentBase implements OnInit {
  NavigationPosition = NavigationPosition;
  SidebarSize = SidebarSize;
  themeSettings: IThemeSettings;
  routerEvents: BehaviorSubject<RouterEvent> = new BehaviorSubject(undefined);
  routerEvent: RouterEvent;

  constructor(injector: Injector, themeSettingsService: ThemeManagerService, router: Router) {
    super(injector);
    this.themeSettings = themeSettingsService.getConfiguration();
    router.events.subscribe(this.routerEvents);
    abp.event.on(uiEvents.themeSettingsSaved, () => {
      this.themeSettings = themeSettingsService.getConfiguration();
    });
  }

  ngOnInit(): void {
    this.routerEvents.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event) => {
      this.routerEvent = event;
    });
  }
}
