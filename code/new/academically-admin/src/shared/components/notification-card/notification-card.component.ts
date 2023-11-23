import { Component, Injector, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { NotificationDto, UserDto } from '@shared/service-proxies/service-proxies';
import { AppConsts } from '@shared/AppConsts';
import * as _ from 'lodash';

@Component({
  selector: 'app-notification-card',
  templateUrl: './notification-card.component.html',
  styleUrls: ['./notification-card.component.less']
})
export class NotificationCardComponent extends AppComponentBase {
  @Input() notification: NotificationDto;

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

  getDominantUser(notification: NotificationDto): UserDto {
    return notification.actors?.[0]?.user;
  }

  getNotificationReceivedTime(notification: NotificationDto): string {
    return this.convertMomentToPostDateAgo(notification.creationTime ?? notification.lastModificationTime);
  }

  handleCloseNotification(): void {
    this.notification = null;
  }
}
