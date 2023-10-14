import { Component, Injector, OnInit } from '@angular/core';

import { takeUntil } from '@node_modules/rxjs/operators';
import { AppComponentBase } from '@shared/app-component-base';
import { PurchaseServiceComponent } from '@shared/components/purchase-service/purchase-service.component';
import { ShimmerType } from '@shared/enums/shimmer/shimmer-type.enum';
import { NavigationPosition } from '@shared/enums/theme-settings/navigation-position.enum';
import { IThemeSetting } from '@shared/interfaces/theme-setting.interface';
import { CoachingDto, ServicesServiceProxy, UserDto } from '@shared/service-proxies/service-proxies';
import { LandingPagesService } from '@shared/services/landing-pages.service';
import { ServiceDataService } from '@shared/services/service-data.service';
import { ThemeManagerService } from '@shared/services/theme-manager.service';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';

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

  isPurchased = true;

  constructor(
    injector: Injector,
    _themeSettingsService: ThemeManagerService,
    private _modalService: BsModalService,
    private _landingPageService: LandingPagesService,
    private _serviceData: ServiceDataService,
    private _servicesService: ServicesServiceProxy
  ) {
    super(injector);
    this.themeSettings = _themeSettingsService.getConfiguration();
  }

  get profilePictureUrl(): string { return this.appSession.user.profilePictureUrl; }
  get profileFullName(): string { return `${this.appSession.user.name} ${this.appSession.user.surname}`; }
  get profileCoverPhotoUrl(): string { return this.appSession.user.coverPictureUrl; }
  get coachingTitle(): string { return this.data?.name; }
  get price(): number { return this.data?.price ?? 0; }

  get isLoading$() { return this._landingPageService.isLoading$; }

  ngOnInit(): void {
    this._serviceData.serviceData$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(async data => {
        this.data = data;
        await this.getInitialData();
      });
  }

  private async getInitialData() {
    if (!this.data) return;
    try {
      const purchases = await this._servicesService.getAllPurchases(this.data.id, this.appSession.userId).toPromise();
      this.isPurchased = purchases.length > 0;
    } catch (err) {
      console.error(err);
    }
  }

  public onPurchaseClick() {
    const modalSettings = this.defaultModalSettings as ModalOptions<PurchaseServiceComponent>;
    modalSettings.class = 'modal-lg modal-dialog-centered';
    modalSettings.initialState = { serviceId: this.data.id };
    const modal = this._modalService.show(PurchaseServiceComponent, modalSettings);
    modal.content.onPaid.subscribe(async () => this.getInitialData());
  }
}
