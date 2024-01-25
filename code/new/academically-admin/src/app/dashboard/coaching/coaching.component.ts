import { AfterViewInit, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';

import { AppComponentBase } from '@shared/app-component-base';
import { ChooseTemplateComponent } from './_components/choose-template/choose-template.component';
import { CreateCoachingComponent } from './_components/create-coaching/create-coaching.component';
import { CoachingTemplate } from './_models/coaching-template';
import { DashboardService, DashboardServiceView } from '@app/dashboard/_services/dashboard.service';
import { ShimmerType } from '@shared/enums/shimmer/shimmer-type.enum';
import { DashboardPagesService } from '@shared/services/dashboard-pages.service';
import { ServiceDataService } from '@shared/services/service-data.service';
import { CoachingsServiceProxy, CoachingType, CreateCoachingDto, ServicesType } from '@shared/service-proxies/service-proxies';
import { CreateServiceComponent } from '@shared/modals/create-service/create-service.component';


@Component({
  selector: 'app-coaching',
  templateUrl: './coaching.component.html',
  styleUrls: ['./coaching.component.less'],
  animations: [appModuleAnimation()],
})
export class CoachingComponent extends AppComponentBase implements OnInit, AfterViewInit {
  shimmerType = ShimmerType;
  readonly DashboardServiceView = DashboardServiceView;
  readonly ServicesType = ServicesType;

  constructor(
    injector: Injector,
    private _router: Router,
    private _modalService: BsModalService,
    private _coachingService: CoachingsServiceProxy,
    public _dashboardService: DashboardService,
    private _dashboardPageService: DashboardPagesService,
    private _serviceData: ServiceDataService,
    private _cdr: ChangeDetectorRef
  ) {
    super(injector);
  }

  get dashboardServiceView() { return DashboardServiceView; }
  get serviceType() { return ServicesType.Coaching; }
  get switchButtonText(): string { return this._dashboardService.switchButtonText(); }
  get userView(): string { return this._dashboardService.getUserView(); }
  get isLearnerView(): boolean { return this._dashboardService.getUserView() === DashboardServiceView.learner; }
  get isLoading$() { return this._dashboardPageService.isLoading$; }

  ngOnInit(): void {
    setTimeout(() => this._dashboardPageService.setIsLoading(false), 3000);
    this._cdr.detectChanges();
  }

  ngAfterViewInit(): void {
    this._cdr.detectChanges();
  }

  onCreateCoaching(): void {
    const model = new CreateCoachingDto();
    model.init({ type: CoachingType.Single, name: '' });

    const modalSettings = this.defaultModalSettings as ModalOptions<CreateServiceComponent>;
    modalSettings.initialState = { model, servicesType: ServicesType.Coaching };
    modalSettings.class = 'modal-dialog-centered modal-dialog-create-service';
    modalSettings.backdrop = true;
    modalSettings.ignoreBackdropClick = false;
    modalSettings.keyboard = true;
    const modal = this._modalService.show(CreateServiceComponent, modalSettings);

    modal.content.onCreateService.subscribe(coaching => {
      this._coachingService.create(coaching)
        .pipe(takeUntil(this.destroyed$))
        .subscribe(async response => {
          this.notify.success(this.l('SavedSuccessfully'));
          this._serviceData.createServiceDiscussion(response.id, ServicesType.Coaching, this.currentUserId);
          await this._router.navigate(['/app/dashboard/coaching/', response.id]);
        });
    });
  }

  onNewCoachingClick(): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<ChooseTemplateComponent>;
    const modal = this._modalService.show(ChooseTemplateComponent, modalSettings).content;
    modal.selectTemplate.subscribe((template: CoachingTemplate) => {
      const model = new CreateCoachingDto();
      model.name = '';
      model.type = template.type;

      const createCoachingModalSettings = this.defaultModalSettings as ModalOptions<CreateCoachingComponent>;
      createCoachingModalSettings.initialState = { model: model };
      const createCoachingModal = this._modalService.show(CreateCoachingComponent, createCoachingModalSettings).content;
      createCoachingModal.createCoaching.subscribe(coaching => {
        this._coachingService.create(coaching)
          .pipe(takeUntil(this.destroyed$))
          .subscribe(response => {
            this.notify.success(this.l('SavedSuccessfully'));
            if (response.type === CoachingType.Single) {
              this._router.navigate(['/app/dashboard/coaching/', response.id]);
            } else {
              this._router.navigate(['/app/dashboard/coaching/series/', response.id]);
            }
            this._serviceData.createServiceDiscussion(response.id, ServicesType.Coaching, this.currentUserId);
          });
      });
    });
  }

  handleSwitchView(): void {
    this._dashboardService.handleSwitchView();
    this._cdr.detectChanges();
  }
}
