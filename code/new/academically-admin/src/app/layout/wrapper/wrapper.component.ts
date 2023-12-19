import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { HubService } from '@app/_shared/services/hub.service';
import { HubConnection } from '@microsoft/signalr';
import { AppComponentBase } from '@shared/app-component-base';
import { UpcomingEvent } from '@shared/components/service-notification-popup/service-notification-popup.component';
import { uiEvents } from '@shared/constants/ui-events.constant';
import { NavigationPosition } from '@shared/enums/theme-settings/navigation-position.enum';
import { SidebarSize } from '@shared/enums/theme-settings/sidebar-size.enum';
import { IThemeSetting } from '@shared/interfaces/theme-setting.interface';
import { CoachingDto, CommentsServiceProxy, EventDto, HubEvent, NotificationDto, NotificationsServiceProxy, PostsServiceProxy, ServiceBookingDto, ServicesType } from '@shared/service-proxies/service-proxies';
import { NotificationsStateService } from '@shared/services/notifications-state.service';
import { AppStateConfig, AppStateServices } from '@shared/services/pub-sub.service';
import { StateUpdateType } from '@shared/services/state-base.service';
import { ThemeManagerService } from '@shared/services/theme-manager.service';
import { WrapperService } from '@shared/services/wrapper.service';
import { BehaviorSubject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

const UPCOMING_EVENTS_HUB_NAME = 'upcomingEvents';

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

  upcomingEvents: UpcomingEvent[] = [];
  closingUpcomingEvents: UpcomingEvent[] = [];

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
    private _cdr: ChangeDetectorRef,
  ) {
    super(injector);
    this.themeSetting = themeSettingsService.getConfiguration();
    router.events.subscribe(this.routerEvents);
    abp.event.on(uiEvents.themeSettingsSaved, () => {
      this.themeSetting = themeSettingsService.getConfiguration();
    });
  }

  get upcomingEventsHub(): HubConnection { return this.getHub(UPCOMING_EVENTS_HUB_NAME); }

  async ngOnInit(): Promise<void> {
    await this.initializeUpcomingEventsHub();
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

  private async initializeUpcomingEventsHub(): Promise<void> {
    this.addHub(UPCOMING_EVENTS_HUB_NAME, await this._hubService.getEventsHub({ userId: this.currentUserId }));
    this.upcomingEventsHub.on(HubEvent[HubEvent.UpcomingEvent], ({ booking, data }) => {
      const serviceBookingDto = ServiceBookingDto.fromJS(booking);
      let serviceData = null;
      if (booking) {
        if (booking.type === ServicesType.Coaching) {
          serviceData = CoachingDto.fromJS(data);
        } else {
          serviceData = EventDto.fromJS(data);
        }
        this.upcomingEvents.unshift({ data: serviceData, booking: serviceBookingDto });
      }
      this._cdr.detectChanges();
    });
    this.startHubConnection(UPCOMING_EVENTS_HUB_NAME);
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
          this.timer = setTimeout((): void => this.notification = null, 25_000);
          break;
      }
      this._cdr.detectChanges();
    });
  }

  isUpcomingEventClosing(upcomingEvent: UpcomingEvent): boolean {
    return this.closingUpcomingEvents.includes(upcomingEvent);
  }

  handleCloseEventNotifier(upcomingEvent: UpcomingEvent): void {
    this.closingUpcomingEvents.push(upcomingEvent);
    this._cdr.detectChanges();
    setTimeout(() => {
      this.upcomingEvents = this.upcomingEvents.filter(event => event !== upcomingEvent);
      this._cdr.detectChanges();
    }, 500);
  }
}
