import { AfterViewInit, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';

import { AppComponentBase } from '@shared/app-component-base';
import { CourseWizardComponent } from './course-wizard/course-wizard.component';
import { DashboardService, DashboardServiceView } from '@app/dashboard/_services/dashboard.service';
import { DashboardPagesService } from '@shared/services/dashboard-pages.service';
import { ShimmerType } from '@shared/enums/shimmer/shimmer-type.enum';
import { CreateServiceComponent } from '@shared/modals/create-service/create-service.component';
import { ServiceDataService } from '@shared/services/service-data.service';
import { CourseDto, CoursesServiceProxy, ServicesType } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.less'],
  animations: [appModuleAnimation()],
})
export class CoursesComponent extends AppComponentBase implements OnInit, AfterViewInit {
  shimmerType = ShimmerType;
  readonly DashboardServiceView = DashboardServiceView;
  readonly ServicesType = ServicesType;

  constructor(
    injector: Injector,
    private _modalService: BsModalService,
    private _dashboardService: DashboardService,
    private _dashboardPageService: DashboardPagesService,
    private _cdr: ChangeDetectorRef,
    private _coursesService: CoursesServiceProxy,
    private _serviceData: ServiceDataService,
    private _router: Router
  ) {
    super(injector);
  }

  get switchButtonText(): string { return this._dashboardService.switchButtonText(); }
  get userView(): string { return this._dashboardService.getUserView(); }
  get isLearnerView(): boolean { return this._dashboardService.getUserView() === DashboardServiceView.learner; }
  get isLoading$() { return this._dashboardPageService.isLoading$; }

  ngOnInit(): void {
    setTimeout(() => this._dashboardPageService.setIsLoading(false), 300);
  }

  ngAfterViewInit(): void {
    this._cdr.detectChanges();
  }

  handleSwitchView(): void {
    this._dashboardService.handleSwitchView();
    this._cdr.detectChanges();
  }

  onCreateCourse(): void {
    const model = new CourseDto();
    model.init({ name: '' });

    const modalSettings = this.defaultModalSettings as ModalOptions<CreateServiceComponent>;
    modalSettings.initialState = { model, servicesType: ServicesType.Event };
    modalSettings.class = 'modal-dialog-centered modal-dialog-create-service';
    modalSettings.backdrop = true;
    modalSettings.ignoreBackdropClick = false;
    modalSettings.keyboard = true;
    const modal = this._modalService.show(CreateServiceComponent, modalSettings);

    modal.content.onCreateService.subscribe(e => {
      this._coursesService.create(model)
        .pipe(takeUntil(this.destroyed$))
        .subscribe(async response => {
          this._serviceData.createServiceDiscussion(response.id, ServicesType.Course, this.currentUserId);
          this.notify.success(this.l('SavedSuccessfully'));
          await this._router.navigate(['/app/courses', response.id]);
        });
    });
  }

  onCreateCourseClick(): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<CourseWizardComponent>;
    this._modalService.show(CourseWizardComponent, modalSettings);
  }
}
