import { ChangeDetectorRef, Component, Injector, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { LayoutStoreService } from '@shared/layout/layout-store.service';
import { UpsertPostComponent } from '@shared/modals/upsert-post/upsert-post.component';
import { PostsServiceProxy, SharedType, UserStatus } from '@shared/service-proxies/service-proxies';
import { CommunityPostService, ItemToShare } from '@shared/services/community-post.service';
import { ModalDialogService } from '@shared/services/modal-dialog.service';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { NgcCookieConsentService } from 'ngx-cookieconsent';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserAvatarService } from '@shared/services/user-avatar.service';
import { AppStateConfig, AppStateServices } from '@shared/services/pub-sub.service';
import { UserAvatarStateService } from '@shared/services/user-avatar-state.service';
import { takeUntil } from '@node_modules/rxjs/operators';
import { StateUpdateType } from '@shared/services/state-base.service';

@Component({
  templateUrl: './app.component.html'
})
export class AppComponent extends AppComponentBase implements OnInit, OnDestroy {
  timer: any;
  sidebarExpanded: boolean;
  userAvatarStateService: UserAvatarStateService;

  private navigationSubscription: Subscription;

  constructor(
    injector: Injector,
    private renderer: Renderer2,
    private _modalService: BsModalService,
    private _modalDialogService: ModalDialogService,
    private _layoutStore: LayoutStoreService,
    private _communityPostService: CommunityPostService,
    private _postService: PostsServiceProxy,
    private ccService: NgcCookieConsentService,
    private _router: Router,
    private _userAvatarService: UserAvatarService
  ) {
    super(injector);
  }

  ngOnInit(): void {
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
    this.listenAndCreateUserStatus();
  }

  ngOnDestroy(): void {
    this.navigationSubscription.unsubscribe();
  }

  private listenAndCreateUserStatus(): void {
    this._userAvatarService.createUserStatusReportLog(UserStatus.Online);
    this.navigationSubscription = this._router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this._userAvatarService.createUserStatusReportLog(UserStatus.Online);
      }
    });
  }

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
