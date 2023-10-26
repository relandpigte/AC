import { Component, Injector, OnInit } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';

import { AppComponentBase } from '@shared/app-component-base';
import { NavigationPosition } from '@shared/enums/theme-settings/navigation-position.enum';
import { IThemeSetting } from '@shared/interfaces/theme-setting.interface';
import { ThemeManagerService } from '@shared/services/theme-manager.service';
import { ShimmerType } from '@shared/enums/shimmer/shimmer-type.enum';
import { LandingPagesService } from '@shared/services/landing-pages.service';
import { ServiceDataService } from '@shared/services/service-data.service';
import { takeUntil } from 'rxjs/operators';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { PurchaseServiceComponent } from '@shared/components/purchase-service/purchase-service.component';
import { AppConsts } from '@shared/AppConsts';
import { UpsertPostComponent } from '@shared/modals/upsert-post/upsert-post.component';
import {
  EventCategory,
  EventDto, EventsServiceProxy,
  PostsServiceProxy, SavedServicesServiceProxy,
  ServicesServiceProxy, SharedType,
  UserDto
} from '@shared/service-proxies/service-proxies';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent extends AppComponentBase implements OnInit {
  user: UserDto;
  data: EventDto;
  themeSettings: IThemeSetting;
  NavigationPosition = NavigationPosition;

  shimmerType = ShimmerType;
  isSaved: boolean;

  constructor(
    injector: Injector,
    _themeSettingsService: ThemeManagerService,
    private _modalService: BsModalService,
    private _landingPageService: LandingPagesService,
    private _serviceData: ServiceDataService,
    private _clipboard: Clipboard,
    private _postsService: PostsServiceProxy,
    private _savedService: SavedServicesServiceProxy,
    private _eventsService: EventsServiceProxy
  ) {
    super(injector);
    this.themeSettings = _themeSettingsService.getConfiguration();
  }
  get profilePictureUrl(): string { return this.appSession.user.profilePictureUrl; }
  get profileFullName(): string { return `${this.appSession.user.name} ${this.appSession.user.surname}`; }
  get profileCoverPhotoUrl(): string { return this.appSession.user.coverPictureUrl; }
  get isLoading$() { return this._landingPageService.isLoading$; }
  get eventTitle(): string { return this.data?.name; }
  get eventCategoryName(): string { return this.data?.category === EventCategory.Broadcast ? 'Broadcast' : 'Workshop'; }
  get price(): number { return this.data?.price ?? 0; }
  get isPurchased(): boolean { return this.data?.isPurchased; }

  ngOnInit(): void {
    this._serviceData.serviceData$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(async data => {
        this.data = data;
        this.isSaved = this.data?.isSaved;
      });
  }

  onPurchaseClick(): void {
    if (this.isPurchased) {
      return;
    }
    const modalSettings = this.defaultModalSettings as ModalOptions<PurchaseServiceComponent>;
    modalSettings.class = 'modal-lg modal-dialog-centered';
    modalSettings.initialState = { serviceId: this.data.id, data: this.data };
    const modal = this._modalService.show(PurchaseServiceComponent, modalSettings);
    modal.content.onPaid.subscribe(async () => {
      this.data.isPurchased = true;
      this._serviceData.serviceData = this.data;
    });
  }

  handleShareClick(e: Event): void {
    e.stopPropagation();
    this._postsService.getAvailableService(this.data?.id)
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
    const url = `${AppConsts.appBaseUrl}/app/events/${this.data?.id}/about/`;
    this._clipboard.copy(url);
    (<HTMLBodyElement>document.body).click();
    this.notify.success(this.l('LinkCopiedToClipboard'));
  }

  handleSaveClick(): void {
    if (!!!this.data?.id) { return; }
    if (this.isSaved) {
      this._savedService.delete(this.data.id).subscribe(() => this.isSaved = false);
    } else {
      this._savedService.save(this.data.id).subscribe(() => this.isSaved = true);
    }
  }
}
