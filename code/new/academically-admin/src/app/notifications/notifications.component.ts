import { Component, OnInit, Injector } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { PagedListingComponentBase, PagedAndSortedRequestDto } from '@shared/paged-listing-component-base';
import { UserNotification, NotificationsServiceProxy, UserNotificationPagedResultDto, UserNotificationState } from '@shared/service-proxies/service-proxies';
import { finalize, takeUntil } from 'rxjs/operators';
import { TableHeaderSortData } from '@shared/components/table-header-sort/table-header-sort.component';
import * as _ from 'lodash';
import { uiEvents } from '@shared/constants/ui-events.constant';
import * as moment from 'moment';
import { AppConsts } from '@shared/AppConsts';
import { Router } from '@angular/router';

class PagedNotificationsRequestDto extends PagedAndSortedRequestDto {
  searchFilter: string;
  stateFilter: UserNotificationState;
}

class FormattedNotification {
  id: string;
  message: string;
  state: UserNotificationState;
  creationTime: moment.Moment;
  link: string;
}

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.less'],
  animations: [appModuleAnimation()]
})
export class NotificationsComponent extends PagedListingComponentBase<UserNotification> {
  searchFilter: string;
  stateFilter: UserNotificationState;
  notifications: FormattedNotification[] = [];
  headers: TableHeaderSortData[] = [
    { title: 'Message' },
    { title: 'DateCreated', colspan: 2 },
  ];

  UserNotificationState = UserNotificationState;

  constructor(
    injector: Injector,
    private _router: Router,
    private _notificationsService: NotificationsServiceProxy,
  ) {
    super(injector);

    abp.event.on(uiEvents.notificationRead, (notificationId: string) => {
      const notification = this.notifications.find(e => e.id === notificationId);
      if (notification) {
        notification.state = UserNotificationState.Read;
      }
    });
  }

  onReadNotificationClick(e: Event, notification: FormattedNotification): void {
    e.preventDefault();
    e.stopPropagation();
    this.setNotificationAsRead(notification);
  }

  onViewClick(notification: FormattedNotification): void {
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

  onClearFiltersClick(): void {
    this.searchFilter = '';
    this.stateFilter = undefined;
    this.getDataPage(1);
  }

  protected list(
    request: PagedNotificationsRequestDto,
    pageNumber: number,
    finishedCallback: Function
  ): void {
    request.searchFilter = this.searchFilter;
    request.stateFilter = this.stateFilter;

    this._notificationsService
      .getAllPaged(
        request.searchFilter,
        request.stateFilter,
        request.skipCount,
        request.maxResultCount,
      )
      .pipe(
        finalize(() => {
          finishedCallback();
        })
      )
      .subscribe((result: UserNotificationPagedResultDto) => {
        this.notifications = _.map(result.items, item => {
          const notificationData = item.notification.data;
          const formattedNotification = new FormattedNotification();
          const notificationProperties = _.clone(notificationData.properties);
          delete notificationProperties.Message;
          const props = Object.values(notificationProperties);
          formattedNotification.id = item.id;
          formattedNotification.message = this.l(notificationData.properties.Message.name, ...props);
          formattedNotification.creationTime = item.notification.creationTime;
          formattedNotification.link = notificationProperties.Link;
          formattedNotification.state = item.state;
          return formattedNotification;
        });
        this.showPaging(result, pageNumber);
      });
  }

  private setNotificationAsRead(notification: FormattedNotification): void {
    abp.event.trigger(uiEvents.notificationRead, notification.id);
    this._notificationsService.updateNotificationReadState(notification.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => { });
  }

}
