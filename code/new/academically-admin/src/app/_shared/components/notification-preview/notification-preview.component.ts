import { Component, OnInit, Injector, ChangeDetectorRef, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { NotificationsServiceProxy, DocumentsServiceProxy, UserNotification, UserNotificationState } from '@shared/service-proxies/service-proxies';
import { takeUntil } from 'rxjs/operators';
import * as _ from 'lodash';
import * as moment from 'moment';
import { ModalDirective } from 'ngx-bootstrap/modal';

class FormattedUserNotification {
  userProfilePictureUrl: string;
  notificationMessage: string;
  creationTime: string;
}

@Component({
  selector: 'app-notification-preview',
  templateUrl: './notification-preview.component.html',
  styleUrls: ['./notification-preview.component.less']
})
export class NotificationPreviewComponent extends AppComponentBase implements OnInit {
  @Input() isModal = false;
  @Input() buttonClass = '';
  @ViewChild('notificationsModal') notificationsModal: ModalDirective;

  notifications: FormattedUserNotification[] = [];
  isActive = false;

  constructor(
    injector: Injector,
    private _cd: ChangeDetectorRef,
    private _notificationsService: NotificationsServiceProxy,
    private _documentsService: DocumentsServiceProxy,
  ) {
    super(injector);

    abp.event.on('abp.notifications.received', (notification) => {
      this.formatNotification(notification, true);
      this.isActive = true;
      this._cd.detectChanges();
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
    this.isActive = false;
  }

  private getUserNotifications(): void {
    this._notificationsService.getAll()
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
      const formattedNotification = new FormattedUserNotification();
      const notificationProperties = _.clone(notificationData.properties);
      delete notificationProperties.Message;
      const props = Object.values(notificationProperties);
      formattedNotification.notificationMessage = this.l(notificationData.properties.Message.name, ...props);
      formattedNotification.creationTime = moment(notification.notification.creationTime).fromNow();
      this._documentsService.getProfilePictureUrl(notification.userId)
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
      this._cd.detectChanges();
    }
  }
}
