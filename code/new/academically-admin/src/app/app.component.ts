import { Component, Injector, OnInit, Renderer2 } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { NotificationName } from '@shared/services/pub-sub.service';
import { SignalRAspNetCoreHelper } from '@shared/helpers/SignalRAspNetCoreHelper';
import { LayoutStoreService } from '@shared/layout/layout-store.service';
import { NgcCookieConsentService } from 'ngx-cookieconsent';

@Component({
  templateUrl: './app.component.html'
})
export class AppComponent extends AppComponentBase implements OnInit {
  sidebarExpanded: boolean;

  constructor(
    injector: Injector,
    private renderer: Renderer2,
    private _layoutStore: LayoutStoreService,
    private ccService: NgcCookieConsentService
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.renderer.addClass(document.body, 'sidebar-mini');

    SignalRAspNetCoreHelper.initSignalR();

    abp.event.on('abp.notifications.received', (userNotification) => {
      if(userNotification.notification.notificationName !== NotificationName.PostCreated
      && userNotification.notification.notificationName !== NotificationName.PostUpdated
      && userNotification.notification.notificationName !== NotificationName.PostDeleted
      && userNotification.notification.notificationName !== NotificationName.UserTopicCreated
      && userNotification.notification.notificationName !== NotificationName.UserTopicUpdated
      && userNotification.notification.notificationName !== NotificationName.UserTopicDeleted){
        abp.notifications.showUiNotifyForUserNotification(userNotification, { timer: 10000 });
        console.log(userNotification);

        const message = this.l(userNotification.notification.data.properties.Message.name,
          ...Object.values(userNotification.notification.data.properties));

        // Desktop notification
        Push.create('AbpZeroTemplate', {
          body: message.replace(/<[^>]*>?/gm, ''),
          icon: '/assets/img/ac-logo-light.png',
          timeout: 10000,
          onClick: function () {
            window.focus();
            this.close();
          }
        });
      }
    });

    this._layoutStore.sidebarExpanded.subscribe((value) => {
      this.sidebarExpanded = value;
    });
  }

  toggleSidebar(): void {
    this._layoutStore.setSidebarExpanded(!this.sidebarExpanded);
  }
}
