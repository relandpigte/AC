import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { DashboardService, DashboardServiceView } from '@app/dashboard/_services/dashboard.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.less']
})
export class OverviewComponent extends AppComponentBase implements OnInit {
  constructor(
    injector: Injector,
    private _dashboardService: DashboardService
  ) {
    super(injector);
  }

  get dashboardServiceView() { return DashboardServiceView; }
  get defaultUserView(): DashboardServiceView { return this._dashboardService.getUserView(); }

  ngOnInit(): void {
    this._dashboardService.setUserView(DashboardServiceView.learner);
  }
}
