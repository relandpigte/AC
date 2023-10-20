import { AfterViewInit, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { CourseWizardComponent } from './course-wizard/course-wizard.component';
import { DashboardService, DashboardServiceView } from '@app/dashboard/_services/dashboard.service';
import { DashboardPagesService } from '@shared/services/dashboard-pages.service';
import { ShimmerType } from '@shared/enums/shimmer/shimmer-type.enum';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.less'],
  animations: [appModuleAnimation()],
})
export class CoursesComponent extends AppComponentBase implements OnInit, AfterViewInit {
  shimmerType = ShimmerType;
  readonly DashboardServiceView = DashboardServiceView;

  constructor(
    injector: Injector,
    private _modalService: BsModalService,
    private _dashboardService: DashboardService,
    private _dashboardPageService: DashboardPagesService,
    private _cdr: ChangeDetectorRef
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

  onCreateCourseClick(): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<CourseWizardComponent>;
    this._modalService.show(CourseWizardComponent, modalSettings);
  }
}
