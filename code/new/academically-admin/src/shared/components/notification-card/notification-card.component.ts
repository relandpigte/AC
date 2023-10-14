import { Component, Injector, Input, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { NotificationDto, UserDto } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-notification-card',
  templateUrl: './notification-card.component.html',
  styleUrls: ['./notification-card.component.less']
})
export class NotificationCardComponent extends AppComponentBase implements OnInit {
  @Input() notification: NotificationDto;

  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
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
