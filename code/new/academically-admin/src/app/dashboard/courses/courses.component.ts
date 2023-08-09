import { Component, Injector, OnInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { CourseWizardComponent } from './course-wizard/course-wizard.component';
import { DashboardService, DashboardServiceView } from '@app/dashboard/_services/dashboard.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.less'],
  animations: [appModuleAnimation()],
})
export class CoursesComponent extends AppComponentBase implements OnInit {
  constructor(
    injector: Injector,
    private _modalService: BsModalService,
    private _dashboardService: DashboardService
  ) {
    super(injector);
  }

  get dashboardServiceView() { return DashboardServiceView; }
  get switchButtonText(): string { return this._dashboardService.switchButtonText(); }
  get defaultUserView(): DashboardServiceView { return this._dashboardService.getUserView(); }

  ngOnInit(): void {
    this._dashboardService.setUserView(DashboardServiceView.learner);
  }

  handleSwitchView(): void {
    this._dashboardService.handleSwitchView();
  }

  onCreateCourseClick(): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<CourseWizardComponent>;
    this._modalService.show(CourseWizardComponent, modalSettings);
  }
}
