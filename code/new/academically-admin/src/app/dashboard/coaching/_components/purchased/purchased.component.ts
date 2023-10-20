import { Component, Injector, OnInit } from '@angular/core';
import { finalize, takeUntil } from 'rxjs/operators';

import { AvailableServiceDto, CoachingDto, CoachingsServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/app-component-base';
import { ShimmerType } from '@shared/enums/shimmer/shimmer-type.enum';
import { DashboardPagesService } from '@shared/services/dashboard-pages.service';

@Component({
  selector: 'app-purchased',
  templateUrl: './purchased.component.html',
  styleUrls: ['./purchased.component.less']
})
export class PurchasedComponent extends AppComponentBase implements OnInit {
  upcomingCoachings: AvailableServiceDto[] = [];
  pastCoachings: CoachingDto[] = [];
  cancelledCoachings: CoachingDto[] = [];

  shimmerType = ShimmerType;

  constructor(
    injector: Injector,
    private _dashboardPageService: DashboardPagesService,
    private _coachingService: CoachingsServiceProxy
  ) {
    super(injector);
  }

  get userId(): number { return this.appSession.userId; }
  get isLoading$() { return this._dashboardPageService.isLoading$; }
  get totalUpcomingCoaching(): number { return this.upcomingCoachings?.length; }
  get totalPastCoaching(): number { return this.pastCoachings?.length; }
  get totalCancelledCoaching(): number { return this.cancelledCoachings?.length; }
  get additionalData() {
    return {
      booking: {
        durationInSec: Math.floor(Math.random() * (9000000 - 30000) + 30000),
      }
    };
  }

  ngOnInit(): void {
    this.loadPurchasedCoaching();
  }

  private loadPurchasedCoaching(): void {
    this._dashboardPageService.isLoading$.next(true);
    this._coachingService.getAllPurchasedCoaching(this.userId)
      .pipe(takeUntil(this.destroyed$))
      .pipe(finalize(() => this._dashboardPageService.isLoading$.next(false)))
      .subscribe(data => {
        this.upcomingCoachings = data;
        console.warn(data);
      });
  }
}
