import { TitleCasePipe } from '@angular/common';
import { ChangeDetectorRef, Component, Injector, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HubService } from '@app/_shared/services/hub.service';
import { AppConsts } from '@shared/AppConsts';
import { AppComponentBase } from '@shared/app-component-base';
import { CommentsServiceProxy, NotificationDto, NotificationsServiceProxy, PostsServiceProxy, UserDto, UserNotificationState } from '@shared/service-proxies/service-proxies';
import { NotificationsStateService } from '@shared/services/notifications-state.service';
import { AppStateConfig, AppStateServices } from '@shared/services/pub-sub.service';
import { StateUpdateType } from '@shared/services/state-base.service';
import * as _ from 'lodash';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-notifications-preview',
  templateUrl: './notifications-preview.component.html',
  styleUrls: ['./notifications-preview.component.less'],
  providers: [ TitleCasePipe ]
})
export class NotificationsPreviewComponent extends AppComponentBase implements OnInit {
  notificationsStateService: NotificationsStateService;

  isLoadingList$ = new BehaviorSubject<boolean>(true);

  @Input() isModal = false;
  @Input() buttonClass = '';
  @ViewChild('notificationsModal') notificationsModal: ModalDirective;

  notifications: NotificationDto[] = [];
  totalNotificationsCount = 0;
  UserNotificationState = UserNotificationState;

  get unreadCount(): number { return this.unreadNotifications.length; }
  get unreadNotifications(): NotificationDto[] { return this.notifications?.filter(n => !n.readTime) ?? []; }

  constructor(
    injector: Injector,
    private _cdr: ChangeDetectorRef,
    private _router: Router,
    private _hubService: HubService,
    private _commentsService: CommentsServiceProxy,
    private _postsService: PostsServiceProxy,
    private _notificationsService: NotificationsServiceProxy,
    private _titleCasePipe: TitleCasePipe
  ) {
    super(injector);
  }

  async ngOnInit() {
    await this.initNotificationAppStates();
  }

  private async initNotificationAppStates() {
    const appStateConfig: AppStateConfig = {
        ['notifs']: {
            load: [],
            update: {userId: this.appSession.userId}
        }
    };
    const appStateServices: AppStateServices = {
        ['notifs']: {
            type: NotificationsStateService,
            args: [this._hubService, this._commentsService, this._postsService, this._notificationsService, this._titleCasePipe]
        }
    };
    await this.pubSubService.start(this, appStateConfig, appStateServices);
    this.notificationsStateService = this.pubSubService.getStateService<NotificationsStateService>('notifs');
    this.notificationsStateService.loading$.pipe(takeUntil(this.destroyed$)).subscribe(loading => this.isLoadingList$.next(loading));
    this.notificationsStateService.notifications$.pipe(takeUntil(this.destroyed$)).subscribe(event => {
        switch(event.type) {
          case StateUpdateType.Add:
              this.notifications = [event.data].concat(this.notifications);
              this.totalNotificationsCount++;
              break;
          case StateUpdateType.Update:
              if (event.silent) {
                this.notifications = this.notifications.map(c => c.id === event.data.id ? event.data : c);
              } else {
                const idx = this.notifications.findIndex(c => c.id === event.data.id);
                this.notifications.splice(idx, 1);
                this.notifications = [event.data].concat(this.notifications);
              }
              break;
          case StateUpdateType.Delete:
              this.notifications = this.notifications.filter(c => c.id != event.data.id);
              this.totalNotificationsCount--;
              break;
        }
        this._cdr.detectChanges();
    });
    this.notifications = this.notificationsStateService.getAll();
    this.totalNotificationsCount = this.notificationsStateService.totalNotificationsCount;
  }

  onCloseClick(): void {
    this.notificationsModal.hide();
  }

  onNotificationsModalShow(): void {
    this.notificationsModal.config.backdrop = false;
    this.notificationsModal.show();
  }


  // tslint:disable-next-line: member-ordering
  onNotificationClick(notification: NotificationDto): void {
    this.setNotificationAsRead(notification);
    const decodedUrl = decodeURIComponent(notification.url);
    const urlParts = decodedUrl.split('?');
    const path = urlParts[0].replace(AppConsts.appBaseUrl, '');
    if (urlParts[1]) {
      const queryParamParts = urlParts[1].split('&');
      const queryParams = {};
      _.forEach(queryParamParts, queryParamPart => {
        const parts = queryParamPart.split('=');
        queryParams[parts[0]] = parts[1];
      });
      this._router.navigate([path], { queryParams });
    } else {
      this._router.navigate([path], { queryParams: { n: notification.id } });
    }
  }

  onReadNotificationClick(e: Event, notification: NotificationDto): void {
    e.preventDefault();
    e.stopPropagation();
    this.setNotificationAsRead(notification);
  }

  private setNotificationAsRead(notification: NotificationDto): void {
    this._notificationsService.read(notification.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {});
  }

  getDominantUser(notification: NotificationDto): UserDto {
    return notification.actors?.[0]?.user;
  }

  getNotificationReceivedTime(notification: NotificationDto): string {
    return this.convertMomentToPostDateAgo(notification.creationTime ?? notification.lastModificationTime);
  }
}
