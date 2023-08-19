import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { DashboardPagesService } from '@shared/services/dashboard-pages.service';

@Component({
  selector: 'app-creator',
  templateUrl: './creator.component.html',
  styleUrls: ['./creator.component.less']
})
export class CreatorComponent extends AppComponentBase implements OnInit {

  constructor(
    injector: Injector,
    private _dashboardPageService: DashboardPagesService
  ) {
    super(injector);
  }

  get isLoading$() { return this._dashboardPageService.isLoading$; }

  ngOnInit(): void {
  }

}
