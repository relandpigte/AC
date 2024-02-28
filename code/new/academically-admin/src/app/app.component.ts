import { Component, Injector, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { LayoutStoreService } from '@shared/layout/layout-store.service';
import { UpsertPostComponent } from '@shared/modals/upsert-post/upsert-post.component';
import { PostsServiceProxy, SharedType, UserServiceProxy, UserStatus } from '@shared/service-proxies/service-proxies';
import { CommunityPostService, ItemToShare } from '@shared/services/community-post.service';
import { ModalDialogService } from '@shared/services/modal-dialog.service';
import { AppStateConfig, AppStateServices } from '@shared/services/pub-sub.service';
import { StateUpdateType } from '@shared/services/state-base.service';
import { USER_STATUS_ONLINE_THRESHOLD, UserAvatarStateService } from '@shared/services/user-avatar-state.service';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { HubService } from './_shared/services/hub.service';

export const USER_STATUS_STATE_ID = 'usersStatusState';

@Component({
  templateUrl: './app.component.html'
})
export class AppComponent extends AppComponentBase implements OnInit, OnDestroy {
  sidebarExpanded: boolean;

  private userAvatarInterval: any;
  private userAvatarStateService: UserAvatarStateService;

  constructor(
    injector: Injector,
    private renderer: Renderer2,
    private _modalService: BsModalService,
    private _modalDialogService: ModalDialogService,
    private _layoutStore: LayoutStoreService,
    private _communityPostService: CommunityPostService,
    private _postService: PostsServiceProxy,
    private _router: Router,
    private _hubService: HubService,
    private _userService: UserServiceProxy,
  ) {
    super(injector);
  }

  async ngOnInit() {
    this.renderer.addClass(document.body, 'sidebar-mini');

    abp.event.on('abp.notifications.received', (userNotification) => {
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
    });

    this._layoutStore.sidebarExpanded.subscribe((value) => {
      this.sidebarExpanded = value;
    });

    this.listenToNewItemsToShare();

    await this.initUserAvatarAppState();
    this.listenAndCreateUserStatus();
  }

  ngOnDestroy(): void {
    this.userAvatarStateService?.stop();
  }

  // user avatars [start]
  private listenAndCreateUserStatus(): void {
    this.userAvatarStateService.reportUserStatusReportLog(UserStatus.Online);
    this.pipeDestroy(this._router.events, event => {
      if (event instanceof NavigationEnd) {
        this.userAvatarStateService.reportUserStatusReportLog(UserStatus.Online);
      }
    });
  }

  private async initUserAvatarAppState(): Promise<void> {
    const appStateConfig: AppStateConfig = {
      [USER_STATUS_STATE_ID]: { load: [], update: {} }
    };
    const appStateServices: AppStateServices = {
      [USER_STATUS_STATE_ID]: { type: UserAvatarStateService, args: [this._hubService, this._userService] }
    };
    await this.pubSubService.start(this, appStateConfig, appStateServices);
    this.userAvatarStateService = this.pubSubService.getStateService<UserAvatarStateService>(USER_STATUS_STATE_ID);
    this.pipeDestroy(this.userAvatarStateService.userStatusLog$, event => {
      if (event.type === StateUpdateType.Add) {
          if (event.data.status === UserStatus.Online && event.data.creatorUserId === this.appSession.userId) {
            if (this.userAvatarInterval) clearTimeout(this.userAvatarInterval);
            this.userAvatarInterval = setTimeout(() => this.userAvatarStateService.reportUserStatusReportLog(UserStatus.Offline), USER_STATUS_ONLINE_THRESHOLD);
          }
      }
      this.cdr.detectChanges();
    });
  }
  // user avatars [end]

  private listenToNewItemsToShare(): void {
    this._communityPostService.newItemToShare$.subscribe(item => this.askToShareToTimeline(item));
  }

  private askToShareToTimeline(item: ItemToShare): void {
    this._modalDialogService.showConfirmDialog({
      title: this.l('Community.Share.AddToTimeline.Title'),
      text: this.l('Community.Share.AddToTimeline.Body'),
      confirmCb: (): void => this.openUpsertPostModal(item)
    });
  }

  private openUpsertPostModal(item: ItemToShare): void {
    this._postService.getAvailableService(item.serviceId)
    .subscribe(service => {
      const modalSettings = this.defaultModalSettings as ModalOptions<UpsertPostComponent>;
      modalSettings.class = "modal-lg";
      modalSettings.initialState = {
        allowTabs: false,
        canRemoveAttachment: false,
        title: 'Community.SharePost',
        activeTab: 'quick-post',
        ...item.paratialInitialState,
        model: {
          sharedId: service.id,
          sharedServiceType: service.serviceType,
          sharedType: SharedType.Service
        },
        selectedService: service,
      };
      this._modalService.show(UpsertPostComponent, modalSettings).content;
    });
  }

  toggleSidebar(): void {
    this._layoutStore.setSidebarExpanded(!this.sidebarExpanded);
  }
}
