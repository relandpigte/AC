import { Component, Injector, OnInit } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { takeUntil } from 'rxjs/operators';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';

import { AppComponentBase } from '@shared/app-component-base';
import { PurchaseServiceComponent } from '@shared/components/purchase-service/purchase-service.component';
import { ShimmerType } from '@shared/enums/shimmer/shimmer-type.enum';
import { NavigationPosition } from '@shared/enums/theme-settings/navigation-position.enum';
import { IThemeSetting } from '@shared/interfaces/theme-setting.interface';
import { LandingPagesService } from '@shared/services/landing-pages.service';
import { ServiceDataService } from '@shared/services/service-data.service';
import { ThemeManagerService } from '@shared/services/theme-manager.service';
import { UpsertPostComponent } from '@shared/modals/upsert-post/upsert-post.component';
import { AppConsts } from '@shared/AppConsts';
import {
  CoachingDto,
  PostsServiceProxy,
  SavedServicesServiceProxy,
  SharedType,
  UserDto
} from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent extends AppComponentBase implements OnInit {
  data: CoachingDto;
  user: UserDto;
  themeSettings: IThemeSetting;
  NavigationPosition = NavigationPosition;

  shimmerType = ShimmerType;
  isPurchased: boolean;
  isSaved: boolean;

  constructor(
    injector: Injector,
    _themeSettingsService: ThemeManagerService,
    private _modalService: BsModalService,
    private _landingPageService: LandingPagesService,
    private _serviceData: ServiceDataService,
    private _clipboard: Clipboard,
    private _postsService: PostsServiceProxy,
    private _savedService: SavedServicesServiceProxy
  ) {
    super(injector);
    this.themeSettings = _themeSettingsService.getConfiguration();
  }

  get profilePictureUrl(): string { return this.appSession.user.profilePictureUrl; }
  get profileFullName(): string { return `${this.appSession.user.name} ${this.appSession.user.surname}`; }
  get profileCoverPhotoUrl(): string { return this.appSession.user.coverPictureUrl; }
  get coachingTitle(): string { return this.data?.name; }
  get price(): number { return this.data?.price ?? 0; }
  get serviceId(): string { return this.data?.id; }
  get serviceOwner(): number { return this.data?.creatorUserId; }

  get isLoading$() { return this._landingPageService.isLoading$; }

  ngOnInit(): void {
    this._serviceData.serviceData$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(async data => {
        this.data = data;
        this.isSaved = this.data?.isSaved;
        this.isPurchased = this.data?.isPurchased;
      });
  }

  onPurchaseClick(): void {
    if (this.isPurchased) {
      return;
    }
    const modalSettings = this.defaultModalSettings as ModalOptions<PurchaseServiceComponent>;
    modalSettings.class = 'modal-lg modal-dialog-centered';
    modalSettings.initialState = { serviceId: this.serviceId, data: this.data };
    const modal = this._modalService.show(PurchaseServiceComponent, modalSettings);
    modal.content.onPaid.subscribe(async () => this.isPurchased = true);
  }

  handleShareClick(e: Event): void {
    e.stopPropagation();
    this._postsService.getAvailableServiceByUser(this.serviceId, this.serviceOwner)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(service => {
        const modalSettings = this.defaultModalSettings as ModalOptions<UpsertPostComponent>;
        modalSettings.class = 'modal-lg';
        modalSettings.initialState = {
          allowTabs: false,
          canRemoveAttachment: false,
          title: 'Community.SharePost',
          activeTab: 'quick-post',
          model: {
            sharedId: service.id,
            sharedServiceType: service.serviceType,
            sharedType: SharedType.Service
          },
          selectedService: service
        };
        this._modalService.show(UpsertPostComponent, modalSettings);
      });
  }

  handleCopyLink(event: Event): void {
    event.stopPropagation();
    const url = `${AppConsts.appBaseUrl}/app/coaching/${this.data?.id}/about/`;
    this._clipboard.copy(url);
    (<HTMLBodyElement>document.body).click();
    this.notify.success(this.l('LinkCopiedToClipboard'));
  }

  handleSaveClick(): void {
    if (!!!this.data?.id) {
      return;
    }
    if (this.isSaved) {
      this._savedService.delete(this.data.id).subscribe(() => this.isSaved = false);
    } else {
      this._savedService.save(this.data.id).subscribe(() => this.isSaved = true);
    }
  }
}
