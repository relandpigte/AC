import { Component, Injector, OnInit } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { takeUntil } from 'rxjs/operators';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';

import { AppComponentBase } from '@shared/app-component-base';
import { ShimmerType } from '@shared/enums/shimmer/shimmer-type.enum';
import { NavigationPosition } from '@shared/enums/theme-settings/navigation-position.enum';
import { IThemeSetting } from '@shared/interfaces/theme-setting.interface';
import { LandingPagesService } from '@shared/services/landing-pages.service';
import { ServiceDataService } from '@shared/services/service-data.service';
import { ThemeManagerService } from '@shared/services/theme-manager.service';
import { UpsertPostComponent } from '@shared/modals/upsert-post/upsert-post.component';
import { AppConsts } from '@shared/AppConsts';
import { BookingServiceComponent } from '@shared/components/booking-service/booking-service.component';
import {
  CoachingDto, PostsServiceProxy, SavedServicesServiceProxy, ServiceBookingDto, ServicesServiceProxy, SharedType,
  UserAvailabilitiesServiceProxy, UserAvailabilityDto, UserAvailabilitySetting, UserDto
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
  userAvailabilities: UserAvailabilityDto[] = [];
  serviceBookings: ServiceBookingDto[] = [];
  coachAvailabilitySettings: UserAvailabilitySetting;

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
    private _userAvailabilitiesService: UserAvailabilitiesServiceProxy,
    private _servicesService: ServicesServiceProxy
  ) {
    super(injector);
    this.themeSettings = _themeSettingsService.getConfiguration();
  }

  get profilePictureUrl() { return this.getProfilePictureUrl(this.data?.creatorUser?.profilePictureDocument); }
  get profileFullName(): string { return this.data?.creatorUser?.fullName; }
  get profileCoverPhotoUrl(): string { return this.appSession.user.coverPictureUrl; }
  get coachingTitle(): string { return this.data?.name; }
  get price(): number { return this.data?.price ?? 0; }
  get serviceId(): string { return this.data?.id; }
  get serviceOwnerId(): number { return this.data?.creatorUserId; }
  get isPurchased(): boolean { return this.data?.isPurchased; }

  get isLoading$() { return this._landingPageService.isLoading$; }

  ngOnInit(): void {
    this.initServiceData();
  }

  onPurchaseClick(): void {
    if (this.isPurchased) {
      return;
    }
    const modalSettings = this.defaultModalSettings as ModalOptions<BookingServiceComponent>;
    modalSettings.class = 'modal-lg modal-dialog-centered modal-dialog-booking';
    modalSettings.initialState = {
      data: this.data,
      title: this.l('BookASession'),
      userAvailabilities: this.userAvailabilities,
      serviceBookings: this.serviceBookings,
      coachAvailabilitySettings: this.coachAvailabilitySettings
    };
    const purchaseModal = this._modalService.show(BookingServiceComponent, modalSettings);

    purchaseModal.content.onPaid.subscribe((): void => {
      this.data.isPurchased = true;
      this._serviceData.serviceData = this.data;
    });

    purchaseModal.content.onSavedBooking.subscribe(booking => {
      this._serviceData.serviceBooking = booking;
    });
  }

  handleShareClick(e: Event): void {
    e.stopPropagation();
    this._postsService.getAvailableServiceByUser(this.serviceId, this.serviceOwnerId)
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
    if (!!!this.data?.id) { return; }
    if (this.isSaved) {
      this._savedService.delete(this.data.id).subscribe(() => this.isSaved = false);
    } else {
      this._savedService.save(this.data.id).subscribe(() => this.isSaved = true);
    }
  }

  private initUserAvailabilities(): void {
    this._userAvailabilitiesService.getAll(this.serviceOwnerId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(availabilities => {
        this.userAvailabilities = availabilities;
      });
  }

  private initUserAvailabilitySettings(): void {
    this._userAvailabilitiesService.getAvailabilitySettings(this.serviceOwnerId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(settings => this.coachAvailabilitySettings = settings);
  }

  private initServiceData(): void {
    this._serviceData.serviceData$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(async data => {
        if (!data) {
          return;
        }
        this.data = data;
        this.isSaved = this.data?.isSaved;
        this.initServiceBookings();
        this.initUserAvailabilities();
        this.initUserAvailabilitySettings();
      });
  }

  private initServiceBookings(): void {
    this._servicesService.getAllBookings(this.serviceId, this.serviceOwnerId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(bookings => {
        this.serviceBookings = bookings;
      });
  }
}
