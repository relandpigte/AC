import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ShimmerType } from '@shared/enums/shimmer/shimmer-type.enum';
import { CoachingDto, CoachingsServiceProxy, CoachingStatus, CoachingType } from '@shared/service-proxies/service-proxies';
import { DashboardPagesService } from '@shared/services/dashboard-pages.service';
import { finalize, takeUntil } from '@node_modules/rxjs/operators';
import { Router } from '@angular/router';
import { ModalDialogOptions, ModalDialogService } from '@shared/services/modal-dialog.service';

type CreatedTab = 'active' | 'draft' | 'archived';

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

  readonly CoachingStatus = CoachingStatus;
  protected readonly fns = {
    [CoachingStatus.Draft]: 'draftCoachings',
    [CoachingStatus.Published]: 'activeCoachings',
    [CoachingStatus.Archived]: 'archiveCoachings'
  };

  activeTab: CreatedTab = 'active';

  constructor(
    injector: Injector,
    private _router: Router,
    private _modalDialogService: ModalDialogService,
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

  onEditClick(data: CoachingDto) {
    this._router.navigate(['/app/dashboard/coaching' + (data?.type === CoachingType.Series ? '/series' : ''), data.id]);
  }

  onDuplicateClick(id: string) {
    this._coachingService.duplicate(id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        this.loadCoaching();
        this.notify.success(this.l('Generics.SuccessfullyDuplicated'));
      });
  }

  onDeleteClick(id: string): void {
    const options: ModalDialogOptions = {
      title: this.l('AreYouSure'),
      text: this.l('Generics.DeleteConfirmationMessageWithType', ['coaching']),
      confirmCb: (): void => {
        this._coachingService.delete(id)
          .pipe(takeUntil(this.destroyed$))
          .subscribe(() => {
            this.loadCoaching();
            this.notify.success(this.l('SuccessfullyDeleted'));
          });
      }
    };
    this._modalDialogService.showConfirmDialog(options);
  }

  onUpdateStatus(data: CoachingDto, changeToStatus: CoachingStatus): void {
    const { id, status } = data;
    const service = this[this.fns[status]]?.find(x => x.id === id);
    if (!service) {
      return;
    }
    this._coachingService.updateStatus(id, changeToStatus)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((): void => {
        this.notify.success(this.l('SavedSuccessfully'));
        this[this.fns[status]] = this[this.fns[status]]?.filter(x => x.id !== id);
        service.status = changeToStatus;
        this[this.fns[changeToStatus]].push(service);
      });
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
