import { Component, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';

@Component({
  selector: 'app-dashboard-overview',
  templateUrl: './dashboard-overview.component.html',
  styleUrls: ['./dashboard-overview.component.less']
})
export class DashboardOverviewComponent extends AppComponentBase {
  isTutor: boolean;

  constructor(
    injector: Injector,
  ) {
    super(injector);
    this.isTutor = this.appSession.user.roles.findIndex(e => e.toLowerCase() === 'tutor') >= 0;
  }

}
