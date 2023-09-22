import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ShimmerType } from '@shared/enums/shimmer/shimmer-type.enum';
import { CourseDto, CoursesServiceProxy } from '@shared/service-proxies/service-proxies';
import { DashboardPagesService } from '@shared/services/dashboard-pages.service';
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

  constructor(
    injector: Injector,
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
}
