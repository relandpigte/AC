import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ShimmerType } from '@shared/enums/shimmer/shimmer-type.enum';
import { CoachingDto, CoachingsServiceProxy } from '@shared/service-proxies/service-proxies';
import { DashboardPagesService } from '@shared/services/dashboard-pages.service';
import { finalize, takeUntil } from '@node_modules/rxjs/operators';

@Component({
  selector: 'app-created',
  templateUrl: './created.component.html',
  styleUrls: ['./created.component.less']
})
export class CreatedComponent extends AppComponentBase implements OnInit {
  activeCoachings: CoachingDto[] = [];
  draftCoachings: CoachingDto[] = [];
  archiveCoachings: CoachingDto[] = [];

  shimmerType = ShimmerType;

  constructor(
    injector: Injector,
    private _dashboardPageService: DashboardPagesService,
    private _coachingService: CoachingsServiceProxy
  ) {
    super(injector);
  }

  get isLoading$() { return this._dashboardPageService.isLoading$; }
  get userId(): number { return this.appSession.userId; }
  get totalActiveCoaching(): number { return this.activeCoachings?.length; }
  get totalDraftCoaching(): number { return this.draftCoachings?.length; }
  get totalArchivedCoaching(): number { return this.archiveCoachings?.length; }

  ngOnInit(): void {
    this.loadCoaching();
  }

  private loadCoaching(): void {
    this._dashboardPageService.isLoading$.next(true);
    this._coachingService.getAll(undefined, this.userId, undefined, undefined, undefined, undefined, undefined)
      .pipe(takeUntil(this.destroyed$))
      .pipe(finalize(() => this._dashboardPageService.isLoading$.next(false)))
      .subscribe(coachings => {
        this.activeCoachings = coachings?.items.filter(a => a.status === 1);
        this.draftCoachings = coachings?.items.filter(a => a.status === 0);
        this.archiveCoachings = coachings?.items.filter(a => a.status === 2);
      });
  }
}
