import { Component, Injector, OnInit } from '@angular/core';
import { finalize, takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import * as moment from 'moment';

import { AppComponentBase } from '@shared/app-component-base';
import { ShimmerType } from '@shared/enums/shimmer/shimmer-type.enum';
import { EventDto, EventsServiceProxy } from '@shared/service-proxies/service-proxies';
import { DashboardPagesService } from '@shared/services/dashboard-pages.service';

@Component({
  selector: 'app-created',
  templateUrl: './created.component.html',
  styleUrls: ['./created.component.less']
})
export class CreatedComponent extends AppComponentBase implements OnInit {
  upcomingEvents: EventDto[] = [];
  pastEvents: EventDto[] = [];
  cancelledEvents: EventDto[] = [];
  draftEvents: EventDto[] = [];

  isLoading = true;
  shimmerType = ShimmerType;

  constructor(
    injector: Injector,
    private _dashboardPageService: DashboardPagesService,
    private _eventsService: EventsServiceProxy,
    private _router: Router
  ) {
    super(injector);
  }

  get isLoading$() { return this._dashboardPageService.isLoading$; }
  get totalUpcomingEvents(): number { return this.upcomingEvents?.length; }
  get totalPastEvents(): number { return this.pastEvents?.length; }
  get totalCancelledEvents(): number { return this.cancelledEvents?.length; }
  get totalDraftEvents(): number { return this.draftEvents?.length; }

  ngOnInit(): void {
    this.initEvents();
  }

  async handleJoinClick(id: string): Promise<void> {
    await this._router.navigate(['app/dashboard/events/portal/broadcast/student', id, 'portal']);
  }

  async onRedirection(e: any, id: string): Promise<void> {
    const tags = ['I', 'A'];
    if (tags.includes(e.target.tagName)) {
      return;
    }

    await this.handleJoinClick(id);
  }

  private initEvents(): void {
    this._dashboardPageService.setIsLoading(true);
    this._eventsService.getAll(
      undefined,
      this.appSession.userId,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined
    )
      .pipe(takeUntil(this.destroyed$))
      .pipe(finalize(() => this._dashboardPageService.setIsLoading(false)))
      .subscribe(events => {
        this.upcomingEvents = events?.items?.filter(e => moment().isBefore(e.eventDateTime) && e.status !== 0);
        this.pastEvents = events?.items?.filter(e => moment().isAfter(e.eventDateTime));
        this.draftEvents = events?.items?.filter(e => e.status === 0);
      });
  }
}
