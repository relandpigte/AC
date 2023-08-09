import { Component, Injector, Input, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ServicesType } from '@shared/service-proxies/service-proxies';
import { DashboardServiceView } from '@app/dashboard/_services/dashboard.service';

@Component({
  selector: 'app-sub-header',
  templateUrl: './sub-header.component.html',
  styleUrls: ['./sub-header.component.less']
})
export class SubHeaderComponent extends AppComponentBase implements OnInit {
  @Input() userView: DashboardServiceView;
  @Input() serviceType: ServicesType;

  constructor(
    injector: Injector
  ) {
    super(injector);
  }

  get dashboardServiceView() { return DashboardServiceView; }
  get servicesType() { return ServicesType; }

  ngOnInit(): void {}
}
