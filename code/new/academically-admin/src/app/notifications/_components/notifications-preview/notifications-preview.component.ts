import { Component, OnInit, Injector, ChangeDetectorRef, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { NotificationsServiceProxy, DocumentsServiceProxy, UserNotification, UserNotificationState } from '@shared/service-proxies/service-proxies';
import { takeUntil } from 'rxjs/operators';
import * as _ from 'lodash';
import * as moment from 'moment';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { AppConsts } from '@shared/AppConsts';
import { uiEvents } from '@shared/constants/ui-events.constant';
import { notificationNames } from '@shared/constants/notification-names.constant';

class FormattedNotification {
  id: string;
  userProfilePictureUrl: string;
  notificationMessage: string;
  creationTime: string;
  link: string;
  state: UserNotificationState;
}

@Component({
  selector: 'app-notifications-preview',
  templateUrl: './notifications-preview.component.html',
  styleUrls: ['./notifications-preview.component.less']
})
export class NotificationsPreviewComponent extends AppComponentBase implements OnInit {
  @Input() isModal = false;
  @Input() buttonClass = '';
  @ViewChild('notificationsModal') notificationsModal: ModalDirective;

  notifications: FormattedNotification[] = [];
  unreadCount = 0;
  UserNotificationState = UserNotificationState;

  constructor(
    injector: Injector,
    private _cd: ChangeDetectorRef,
    private _router: Router,
    private _notificationsService: NotificationsServiceProxy,
    private _documentsService: DocumentsServiceProxy,
  ) {
    super(injector);

    abp.event.on('abp.notifications.received', (notification) => {
      if(notification.notification.notificationName !== notificationNames.postCreated
      && notification.notification.notificationName !== notificationNames.postUpdated){
        console.log(notification);
        this.formatNotification(notification, true);
        this.updateUnreadCount();
        this._cd.detectChanges();
      }
    });

    abp.event.on(uiEvents.notificationRead, (notificationId: string) => {
      const notification = this.notifications.find(e => e.id === notificationId);
      if (notification) {
        notification.state = UserNotificationState.Read;
        this.updateUnreadCount();
      }
    });
  }

  ngOnInit(): void {
    this.getUserNotifications();
  }

  onCloseClick(): void {
    this.notificationsModal.hide();
  }

  onNotificationsModalShow(): void {
    this.notificationsModal.config.backdrop = false;
    this.notificationsModal.show();
  }

  onNotificationClick(notification: FormattedNotification): void {
    this.setNotificationAsRead(notification);
    const decodedUrl = decodeURIComponent(notification.link);
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
      this._router.navigate([path]);
    }
  }

  onReadNotificationClick(e: Event, notification: FormattedNotification): void {
    e.preventDefault();
    e.stopPropagation();
    this.setNotificationAsRead(notification);
  }

  private getUserNotifications(): void {
    this._notificationsService.getRecent()
      .pipe(
        takeUntil(this.destroyed$),
      )
      .subscribe(notifications => {
        this.notifications = [];
        _.forEach(notifications, notification => {
          this.formatNotification(notification);
        });
      });
  }

  private formatNotification(notification: UserNotification, isRecent = false): void {
    const notificationData = notification.notification.data;
    if (notification.notification.data.type === 'Abp.Notifications.LocalizableMessageNotificationData') {
      const formattedNotification = new FormattedNotification();
      const notificationProperties = _.clone(notificationData.properties);
      delete notificationProperties.Message;
      const props = Object.values(notificationProperties);
      formattedNotification.id = notification.id;
      formattedNotification.notificationMessage = this.l(notificationData.properties.Message.name, ...props);
      formattedNotification.creationTime = moment(notification.notification.creationTime).fromNow();
      formattedNotification.link = notificationProperties.Link;
      formattedNotification.state = notification.state;
      this._documentsService.getProfilePictureUrl(notificationProperties.CreatorUserId)
        .pipe(takeUntil(this.destroyed$))
        .subscribe(url => {
          formattedNotification.userProfilePictureUrl = url;
          this._cd.detectChanges();
        });
      if (isRecent) {
        this.notifications.unshift(formattedNotification);
      } else {
        this.notifications.push(formattedNotification);
      }
      this.updateUnreadCount();
      this._cd.detectChanges();
    }
  }

  private updateUnreadCount(): void {
    this.unreadCount = _.filter(this.notifications, e => e.state === UserNotificationState.Unread).length;
    this._cd.detectChanges();
  }

  private setNotificationAsRead(notification: FormattedNotification): void {
    abp.event.trigger(uiEvents.notificationRead, notification.id);
    this._notificationsService.updateNotificationReadState(notification.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => { });
  }
}
