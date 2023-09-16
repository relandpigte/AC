import { ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { uiEvents } from '@shared/constants/ui-events.constant';
import { NavigationPosition } from '@shared/enums/theme-settings/navigation-position.enum';
import { SidebarSize } from '@shared/enums/theme-settings/sidebar-size.enum';
import { IThemeSetting } from '@shared/interfaces/theme-setting.interface';
import { ThemeManagerService } from '@shared/services/theme-manager.service';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { WrapperService } from '@shared/services/wrapper.service';

@Component({
  selector: 'app-wrapper',
  templateUrl: './wrapper.component.html',
  styleUrls: ['./wrapper.component.less']
})
export class WrapperComponent extends AppComponentBase implements OnInit {
  NavigationPosition = NavigationPosition;
  SidebarSize = SidebarSize;
  themeSetting: IThemeSetting;
  routerEvents: BehaviorSubject<RouterEvent> = new BehaviorSubject(undefined);
  routerEvent: RouterEvent;
  canScroll: boolean = true;

  constructor(
    injector: Injector,
    themeSettingsService: ThemeManagerService,
    router: Router,
    private wrapperService: WrapperService,
    private cdr: ChangeDetectorRef
  ) {
    super(injector);
    this.themeSetting = themeSettingsService.getConfiguration();
    router.events.subscribe(this.routerEvents);
    abp.event.on(uiEvents.themeSettingsSaved, () => {
      this.themeSetting = themeSettingsService.getConfiguration();
    });
  }

  ngOnInit(): void {
    this.routerEvents.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event) => {
      this.routerEvent = event;
    });
    this.wrapperService.canScroll$.subscribe(canScroll => this.canScroll = canScroll);
    this.cdr.detectChanges();
  }
}
