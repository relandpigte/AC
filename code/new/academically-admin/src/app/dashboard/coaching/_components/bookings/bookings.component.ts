import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ShimmerType } from '@shared/enums/shimmer/shimmer-type.enum';
import { CoachingDto } from '@shared/service-proxies/service-proxies';
import { DashboardPagesService } from '@shared/services/dashboard-pages.service';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.less']
})
export class BookingsComponent extends AppComponentBase implements OnInit {
  coachings: CoachingDto[] = Array(Math.floor(Math.random() * (10 - 4) + 4))
    .fill([]).map(() => this.generateRandomCoaching()) as CoachingDto[];

  isLoading = true;
  shimmerType = ShimmerType;

  constructor(
    injector: Injector,
    private _dashboardPageService: DashboardPagesService
  ) {
    super(injector);
  }

  get isLoading$() { return this._dashboardPageService.isLoading$; }
  get additionalData() {
    return {
      booking: {
        durationInSec: Math.floor(Math.random() * (9000000 - 30000) + 30000),
      }
    };
  }
  get totalCoaching(): number { return this.coachings?.length; }

  ngOnInit(): void {}
}
