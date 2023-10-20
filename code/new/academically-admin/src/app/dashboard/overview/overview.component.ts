import { Component, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { DashboardService, DashboardServiceView } from '@app/dashboard/_services/dashboard.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.less']
})
export class OverviewComponent extends AppComponentBase {
  readonly DashboardServiceView = DashboardServiceView;

  constructor(
    injector: Injector,
    private _dashboardService: DashboardService
  ) {
    super(injector);
  }
  get userView(): string { return this._dashboardService.getUserView(); }
}
