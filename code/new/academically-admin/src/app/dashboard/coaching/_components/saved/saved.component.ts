import { Component, Injector, OnInit } from '@angular/core';
import { finalize, takeUntil } from 'rxjs/operators';

import { Router } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { PurchaseServiceComponent } from '@shared/components/purchase-service/purchase-service.component';
import { ShimmerType } from '@shared/enums/shimmer/shimmer-type.enum';
import { UpsertPostComponent } from '@shared/modals/upsert-post/upsert-post.component';
import { CoachingDto, CoachingsServiceProxy, PostsServiceProxy, ServicesServiceProxy } from '@shared/service-proxies/service-proxies';
import { DashboardPagesService } from '@shared/services/dashboard-pages.service';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-saved',
  templateUrl: './saved.component.html',
  styleUrls: ['./saved.component.less']
})
export class SavedComponent extends AppComponentBase implements OnInit {
  savedCoachings: CoachingDto[] = [];

  shimmerType = ShimmerType;

  constructor(
    injector: Injector,
    private _router: Router,
    private _modalService: BsModalService,
    private _dashboardPageService: DashboardPagesService,
    private _coachingService: CoachingsServiceProxy,
    private _postsService: PostsServiceProxy,
    private _servicesService: ServicesServiceProxy
  ) {
    super(injector);
  }

  get userId(): number { return this.appSession.userId; }
  get isLoading$() { return this._dashboardPageService.isLoading$; }

  ngOnInit(): void {
    this.loadSavedCoaching();
  }

  private loadSavedCoaching(isSilent = false): void {
    if (!isSilent) this._dashboardPageService.isLoading$.next(true);
    this._coachingService.getAllSavedCoaching(this.userId)
      .pipe(takeUntil(this.destroyed$))
      .pipe(finalize(() => this._dashboardPageService.isLoading$.next(false)))
      .subscribe(data => {
        this.savedCoachings = data;
      });
  }

  handleServiceCardClick(coaching: CoachingDto): void {
    this._router.navigate(['app/coaching' , coaching.id, 'about']);
  }

  handleServiceCardShareClick(service: any): void {
    this._dashboardPageService.isLoading$.next(true);
    this._postsService.getAvailableServiceByUser(service.id, service.creatorUserId)
      .pipe(takeUntil(this.destroyed$))
      .pipe(finalize(() => this._dashboardPageService.isLoading$.next(false)))
      .subscribe(service => {
        const modalSettings = this.defaultModalSettings as ModalOptions<UpsertPostComponent>;
        modalSettings.class = 'modal-lg';
        modalSettings.initialState = {
          allowTabs: false,
          canRemoveAttachment: false,
          title: 'Community.SharePost',
          activeTab: 'quick-post',
          model: { serviceId: service.id },
          selectedService: service
        };
        this._modalService.show(UpsertPostComponent, modalSettings).content;
      });
  }

  async handleServiceCardActionClick(event: any) {
    try {
      const { action, data } = event;
      switch(action) {
        case 'purchase':
          await this.onPurchaseClick(data);
          break;
        case 'save':
          this.loadSavedCoaching(true);
          break;
      }
    } catch(err) {
      console.error(err);
    }
  }

  private async onPurchaseClick(service: any) {
    if (!service) return;

    const purchase = await this._servicesService.getAllPurchases(service.id, this.appSession.userId).toPromise();
    if (purchase?.length) {
      this._router.navigate(['app/coaching' , service.id, 'about']);
    } else {
      const modalSettings = this.defaultModalSettings as ModalOptions<PurchaseServiceComponent>;
      modalSettings.class = 'modal-lg modal-dialog-centered';
      modalSettings.initialState = { serviceId: service.id, data: service};
      const modal = this._modalService.show(PurchaseServiceComponent, modalSettings);
      modal.content.onPaid.subscribe(() => this._router.navigate(['app/coaching' , service.id, 'about']));
    }
  }

}
