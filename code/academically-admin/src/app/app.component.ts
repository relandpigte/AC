import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { uiEvents } from '@shared/constants/ui-events';
import { IThemeSettings } from '@shared/models/theme-settings/theme-settings.interface';
import { ThemeManagerService } from '@shared/services/theme-manager.service';
import { NavigationPosition } from '@shared/enums/theme-settings/navigation-position.enum';
import { BehaviorSubject } from 'rxjs';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SidebarSize } from '@shared/enums/theme-settings/sidebar-size.enum';

@Component({
  templateUrl: './app.component.html',
})
export class AppComponent extends AppComponentBase implements OnInit {
  NavigationPosition = NavigationPosition;
  SidebarSize = SidebarSize;
  themeSettings: IThemeSettings;
  routerEvents: BehaviorSubject<RouterEvent> = new BehaviorSubject(undefined);
  routerEvent: RouterEvent;

  constructor(themeSettingsService: ThemeManagerService, router: Router, injector: Injector) {
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
