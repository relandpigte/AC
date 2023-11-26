import { Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { ShimmerType } from '@shared/enums/shimmer/shimmer-type.enum';
import {
  CoachingDto,
  CoachingStatus,
  CourseDto,
  CoursesServiceProxy,
  CourseStatus
} from '@shared/service-proxies/service-proxies';
import { DashboardPagesService } from '@shared/services/dashboard-pages.service';
import { ModalDialogOptions, ModalDialogService } from '@shared/services/modal-dialog.service';
import { finalize, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-created',
  templateUrl: './created.component.html',
  styleUrls: ['./created.component.less']
})
export class CreatedComponent extends AppComponentBase implements OnInit {
  activeCourses: CourseDto[] = [];
  draftCourses: CourseDto[] = [];
  archiveCourses: CourseDto[] = [];
  shimmerType = ShimmerType;

  readonly CourseStatus = CourseStatus;
  protected readonly fns = {
    [CourseStatus.Draft]: 'draftCourses',
    [CourseStatus.Published]: 'activeCourses',
    [CourseStatus.Archived]: 'archiveCourses'
  };
  constructor(
    injector: Injector,
    private _router: Router,
    private _modalDialogService: ModalDialogService,
    private _dashboardPageService: DashboardPagesService,
    private _coursesService: CoursesServiceProxy
  ) {
    super(injector);
  }

  get isLoading$() { return this._dashboardPageService.isLoading$; }
  get totalActiveCourses(): number { return this.activeCourses?.length; }
  get totalDraftCourses(): number { return this.draftCourses?.length; }
  get totalArchiveCourses(): number { return this.archiveCourses?.length; }

  ngOnInit(): void {
    this.initCreatedCourses();
  }

  onEditClick(data: CourseDto) {
    this._router.navigate(['/app/courses', data.id]);
  }

  onDuplicateClick(id: string) {
    this._coursesService.duplicate(id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        this.initCreatedCourses();
        this.notify.success(this.l('Generics.SuccessfullyDuplicated'));
      });
  }

  onDeleteClick(id: string): void {
    const options: ModalDialogOptions = {
      title: this.l('AreYouSure'),
      text: this.l('Generics.DeleteConfirmationMessageWithType', ['course']),
      confirmCb: (): void => {
        this._coursesService.delete(id)
          .pipe(takeUntil(this.destroyed$))
          .subscribe(() => {
            this.initCreatedCourses();
            this.notify.success(this.l('SuccessfullyDeleted'));
          });
      }
    };
    this._modalDialogService.showConfirmDialog(options);
  }


  onUpdateStatus(data: CourseDto, changeToStatus: CourseStatus): void {
    const { id, status } = data;
    const service = this[this.fns[status]]?.find(x => x.id === id);
    if (!service) {
      return;
    }
    this._coursesService.updateStatus(id, changeToStatus)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((): void => {
        this.notify.success(this.l('SavedSuccessfully'));
        this[this.fns[status]] = this[this.fns[status]]?.filter(x => x.id !== id);
        service.status = changeToStatus;
        this[this.fns[changeToStatus]].push(service);
      });
  }

  private initCreatedCourses(): void {
    this._dashboardPageService.isLoading$.next(true);
    this._coursesService.getAll(this.appSession.userId, undefined, undefined, undefined, undefined, undefined)
      .pipe(takeUntil(this.destroyed$))
      .pipe(finalize((): void => {
        this._dashboardPageService.isLoading$.next(false);
      }))
      .subscribe(courses => {
        this.activeCourses = courses?.items.filter(c => c.status === 1);
        this.draftCourses = courses?.items.filter(c => c.status === 0);
        this.archiveCourses = courses?.items.filter(c => c.status === 2);
      });
  }

  protected readonly CoachingStatus = CoachingStatus;
}
