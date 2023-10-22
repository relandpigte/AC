import { Component, Injector, OnInit } from '@angular/core';
import { finalize, takeUntil } from 'rxjs/operators';

import { CourseDto, CoursesServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/app-component-base';
import { ShimmerType } from '@shared/enums/shimmer/shimmer-type.enum';
import { DashboardPagesService } from '@shared/services/dashboard-pages.service';
import { AppConsts } from '@shared/AppConsts';


@Component({
  selector: 'app-purchased',
  templateUrl: './purchased.component.html',
  styleUrls: ['./purchased.component.less']
})
export class PurchasedComponent extends AppComponentBase implements OnInit {
  allCourses: CourseDto[] = [];
  todoCourses: CourseDto[] = [];
  completedCourses: CourseDto[] = [];
  shimmerType = ShimmerType;

  constructor(
    injector: Injector,
    private _dashboardPageService: DashboardPagesService,
    private _coursesService: CoursesServiceProxy
  ) {
    super(injector);
  }

  get isLoading$() { return this._dashboardPageService.isLoading$; }
  get totalCourses(): number { return this.allCourses?.length; }
  get totalTodoCourses(): number { return this.todoCourses?.length; }
  get totalCompletedCourses(): number { return this.completedCourses?.length; }

  ngOnInit(): void {
    this.initCourses();
  }

  handleRedirectToCourse(courseId: string): void {
    const url = `${AppConsts.appBaseUrl}/app/student-portal/${courseId}/home`;
    window.open(url, '_blank');
  }

  private initCourses(): void {
    this._dashboardPageService.isLoading$.next(true);
    this._coursesService.getEnrolledCoursesByUser()
      .pipe(takeUntil(this.destroyed$))
      .pipe(finalize((): void => {
        this._dashboardPageService.isLoading$.next(false);
      }))
      .subscribe((courses: CourseDto[]): void => {
        this.allCourses = courses;
        this.todoCourses = courses.filter(c => c.progress < 100);
        this.completedCourses = courses.filter(c => c.progress === 100);
        console.warn(courses);
      });
  }
}
