import { Component, Injector, OnInit, Renderer2 } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { SignalRAspNetCoreHelper } from '@shared/helpers/SignalRAspNetCoreHelper';
import { LayoutStoreService } from '@shared/layout/layout-store.service';
import { AppAuthService } from '@shared/auth/app-auth.service';
import { GetProfileDetailDto, UserLoginInfoDto } from '@shared/service-proxies/service-proxies';
import { uiEvents } from '@shared/constants/ui-events';

@Component({
  templateUrl: './app.component.html'
})
export class AppComponent extends AppComponentBase implements OnInit {
  sidebarExpanded: boolean;
  user: UserLoginInfoDto = new UserLoginInfoDto();

  constructor(
    injector: Injector,
    private renderer: Renderer2,
    private _layoutStore: LayoutStoreService,
    private _authService: AppAuthService,
  ) {
    super(injector);
    this.user = this.appSession.user;
    abp.event.on(uiEvents.profileDetailsUpdated, (item: GetProfileDetailDto) => {
      this.user.profilePictureUrl = item.profilePictureUrl;
    });
  }

  ngOnInit(): void {
    SignalRAspNetCoreHelper.initSignalR();

    abp.event.on('abp.notifications.received', (userNotification) => {
      abp.notifications.showUiNotifyForUserNotification(userNotification);

      // Desktop notification
      Push.create('AbpZeroTemplate', {
        body: userNotification.notification.data.message,
        icon: abp.appPath + 'assets/app-logo-small.png',
        timeout: 6000,
        onClick: function () {
          window.focus();
          this.close();
        }
      });
    });

    this._layoutStore.sidebarExpanded.subscribe((value) => {
      this.sidebarExpanded = value;
    });
  }

  toggleSidebar(): void {
    this._layoutStore.setSidebarExpanded(!this.sidebarExpanded);
  }

  onLogoutClick(): void {
    this._authService.logout();
  }
}
