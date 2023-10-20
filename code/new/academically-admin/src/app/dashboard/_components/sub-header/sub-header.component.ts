import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Injector, Input, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ServicesType } from '@shared/service-proxies/service-proxies';
import { DashboardService, DashboardServiceView } from '@app/dashboard/_services/dashboard.service';
import { takeUntil } from '@node_modules/rxjs/operators';
import { DashboardPagesService } from '@shared/services/dashboard-pages.service';

@Component({
  selector: 'app-sub-header',
  templateUrl: './sub-header.component.html',
  styleUrls: ['./sub-header.component.less']
})
export class SubHeaderComponent extends AppComponentBase implements OnInit, AfterViewInit {
  @Input() userView: string;
  @Input() serviceType: ServicesType;

  tab: string;

  constructor(
    injector: Injector,
    private _dashboardPageService: DashboardPagesService,
    private _dashboardService: DashboardService,
    private _elRef: ElementRef,
    private _cdr: ChangeDetectorRef
  ) {
    super(injector);

    this._dashboardPageService.currentTab$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(tab => {
        this.tab = tab;
      });
  }

  get dashboardServiceView() { return DashboardServiceView; }
  get servicesType() { return ServicesType; }

  ngOnInit(): void {
    if (this.tab) {
      this._dashboardService.setUserView(DashboardServiceView.learner);
      setTimeout(() => {
        this._elRef.nativeElement.querySelector(`.${this.tab}-menu`).click();
        this._dashboardPageService.setCurrentTab(null);
      });
    }
  }

  ngAfterViewInit(): void {
    this._cdr.detectChanges();
  }
}
