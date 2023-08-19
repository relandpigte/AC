import { Component, Injector, OnInit } from '@angular/core';
import { DashboardService, DashboardServiceView } from '@app/dashboard/_services/dashboard.service';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { ShimmerType } from '@shared/enums/shimmer/shimmer-type.enum';
import { DashboardPagesService } from '@shared/services/dashboard-pages.service';
import { BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-tutorials',
  templateUrl: './tutorials.component.html',
  styleUrls: ['./tutorials.component.less'],
  animations: [appModuleAnimation()],
})
export class TutorialsComponent extends AppComponentBase implements OnInit {
  shimmerType = ShimmerType;
  constructor(
    injector: Injector,
    private _modalService: BsModalService,
    private _dashboardService: DashboardService,
    private _dashboardPageService: DashboardPagesService
  ) {
    super(injector);
  }

  get dashboardServiceView() { return DashboardServiceView; }
  get switchButtonText(): string { return this._dashboardService.switchButtonText(); }
  get defaultUserView(): DashboardServiceView { return this._dashboardService.getUserView(); }
  get isLearnerView(): boolean { return this._dashboardService.getUserView() === DashboardServiceView.learner; }
  get isCreatorView(): boolean { return this._dashboardService.getUserView() === DashboardServiceView.creator; }
  get isLoading$() { return this._dashboardPageService.isLoading$; }

  ngOnInit(): void {
    this._dashboardService.setUserView(DashboardServiceView.learner);
    setTimeout(() => this._dashboardPageService.setIsLoading(false), 3000);
  }

  handleSwitchView(): void {
    this._dashboardService.handleSwitchView();
  }
}
