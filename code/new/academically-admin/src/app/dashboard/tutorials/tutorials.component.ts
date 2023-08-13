import { Component, Injector, OnInit } from '@angular/core';
import { DashboardService, DashboardServiceView } from '@app/dashboard/_services/dashboard.service';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-tutorials',
  templateUrl: './tutorials.component.html',
  styleUrls: ['./tutorials.component.less'],
  animations: [appModuleAnimation()],
})
export class TutorialsComponent extends AppComponentBase implements OnInit {
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
}
