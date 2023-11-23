import { ChangeDetectorRef, Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { uiEvents } from '@shared/constants/ui-events.constant';
import { NavigationPosition } from '@shared/enums/theme-settings/navigation-position.enum';
import { SidebarSize } from '@shared/enums/theme-settings/sidebar-size.enum';
import { IThemeSetting } from '@shared/interfaces/theme-setting.interface';
import { ThemeManagerService } from '@shared/services/theme-manager.service';
import { BehaviorSubject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { TitleCasePipe } from '@angular/common';
import { WrapperService } from '@shared/services/wrapper.service';
import { AppStateConfig, AppStateServices } from '@shared/services/pub-sub.service';
import { NotificationsStateService } from '@shared/services/notifications-state.service';
import { StateUpdateType } from '@shared/services/state-base.service';
import { HubService } from '@app/_shared/services/hub.service';
import { CommentsServiceProxy, NotificationDto, NotificationsServiceProxy, PostsServiceProxy } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-wrapper',
  templateUrl: './wrapper.component.html',
  styleUrls: ['./wrapper.component.less'],
  providers: [ TitleCasePipe ]
})
export class WrapperComponent extends AppComponentBase implements OnInit, OnDestroy {
  NavigationPosition = NavigationPosition;
  SidebarSize = SidebarSize;
  themeSetting: IThemeSetting;
  routerEvents: BehaviorSubject<RouterEvent> = new BehaviorSubject(undefined);
  routerEvent: RouterEvent;
  canScroll: boolean = true;

  notificationsStateService: NotificationsStateService;
  notification: NotificationDto;
  isLoadingList$ = new BehaviorSubject<boolean>(true);
  timer: any;

  constructor(
    injector: Injector,
    themeSettingsService: ThemeManagerService,
    router: Router,
    private wrapperService: WrapperService,
    private _notificationsService: NotificationsServiceProxy,
    private _titleCasePipe: TitleCasePipe,
    private _hubService: HubService,
    private _commentsService: CommentsServiceProxy,
    private _postsService: PostsServiceProxy,
    private _cdr: ChangeDetectorRef
  ) {
    super(injector);
    this.themeSetting = themeSettingsService.getConfiguration();
    router.events.subscribe(this.routerEvents);
    abp.event.on(uiEvents.themeSettingsSaved, () => {
      this.themeSetting = themeSettingsService.getConfiguration();
    });
  }

  async ngOnInit(): Promise<void> {
    await this.initNotificationAppStates();
    this.routerEvents.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event) => {
      this.routerEvent = event;
    });
    this.wrapperService.canScroll$.subscribe(canScroll => this.canScroll = canScroll);
    this._cdr.detectChanges();
  }

  async ngOnDestroy() {
    if (this.timer) {
      clearTimeout(this.timer);
    }

    await this.notificationsStateService?.stop();
  }

  private async initNotificationAppStates(): Promise<void> {
    const appStateConfig: AppStateConfig = {
      ['notification']: {
        load: [],
        update: { userId: this.appSession.userId}
      }
    };
    const appStateServices: AppStateServices = {
      ['notification']: {
        type: NotificationsStateService,
        args: [this._hubService, this._commentsService, this._postsService, this._notificationsService, this._titleCasePipe]
      }
    };
    await this.pubSubService.start(this, appStateConfig, appStateServices);
    this.notificationsStateService = this.pubSubService.getStateService<NotificationsStateService>('notifs');
    this.notificationsStateService.loading$.pipe(takeUntil(this.destroyed$)).subscribe(loading => this.isLoadingList$.next(loading));
    this.notificationsStateService.notifications$.pipe(takeUntil(this.destroyed$)).subscribe(event => {
      if (event.data.readTime !== undefined) {
        return;
      }
      switch (event.type) {
        case StateUpdateType.Add:
        case StateUpdateType.Update:
          if (this.timer) {
            clearTimeout(this.timer);
          }
          this.notification = event.data;
          this.timer = setTimeout((): void => this.notification = null, 5_000);
          break;
      }
      this._cdr.detectChanges();
    });
  }
}
