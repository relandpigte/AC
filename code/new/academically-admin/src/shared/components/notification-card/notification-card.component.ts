import { Component, EventEmitter, Injector, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { NotificationAction, NotificationDto, UserDto } from '@shared/service-proxies/service-proxies';
import { AppConsts } from '@shared/AppConsts';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'app-notification-card',
  templateUrl: './notification-card.component.html',
  styleUrls: ['./notification-card.component.less']
})
export class NotificationCardComponent extends AppComponentBase {
  @Input() notification: NotificationDto;
  @Output() onCloseNotification = new EventEmitter<any>();

  constructor(injector: Injector, private _router: Router) {
    super(injector);
  }

  async onNotificationClick(): Promise<void> {
    const decodedUrl = decodeURIComponent(this.notification.url);
    const urlParts = decodedUrl.split('?');
    const path = urlParts[0].replace(AppConsts.appBaseUrl, '');
    if (urlParts[1]) {
      const queryParamParts = urlParts[1].split('&');
      const queryParams = {};
      _.forEach(queryParamParts, queryParamPart => {
        const parts = queryParamPart.split('=');
        queryParams[parts[0]] = parts[1];
      });
      await this._router.navigate([path], { queryParams });
    } else {
      await this._router.navigate([path], { queryParams: { n: this.notification.id } });
    }
  }

  isNotificationForBooking(notification: NotificationDto): boolean {
    return notification.action === NotificationAction.Book ||
      notification.action === NotificationAction.Cancel ||
      notification.action === NotificationAction.Reschedule;
  }

  isShowSchedule(notification: NotificationDto): boolean {
    return notification.action === NotificationAction.Book ||
      notification.action === NotificationAction.Reschedule;
  }

  isShowOldSchedule(notification: NotificationDto): boolean {
    return notification.action === NotificationAction.Cancel ||
      notification.action === NotificationAction.Reschedule;
  }

  getDominantUser(notification: NotificationDto): UserDto {
    return notification.actors?.[0]?.user;
  }

  getNotificationReceivedTime(notification: NotificationDto): string {
    return this.convertMomentToPostDateAgo(notification.creationTime ?? notification.lastModificationTime);
  }

  getNotificationLines(notification: NotificationDto): number {
    return this.isNotificationForBooking(notification) ? 2 : 3;
  }

  getBookingSchedule(notification: NotificationDto): string {
    if (!notification.additionalData) return null;
    const data = JSON.parse(notification.additionalData);
    if (!data?.bookingDateTime) return null;
    return this.convertMomentToShorterPostDateFormat(moment(data.bookingDateTime));
  }

  getOldBookingSchedule(notification: NotificationDto): string {
    if (!notification.additionalData) return null;
    const data = JSON.parse(notification.additionalData);
    if (!data?.oldBookingDateTime) return null;
    return this.convertMomentToShorterPostDateFormat(moment(data.oldBookingDateTime));
  }

  handleCloseNotification(): void {
    this.onCloseNotification.emit();
  }
}
