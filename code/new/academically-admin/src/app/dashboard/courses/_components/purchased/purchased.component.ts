import { Component, Injector, OnInit } from '@angular/core';
import { CourseDto, CoursesServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/app-component-base';
import { ShimmerType } from '@shared/enums/shimmer/shimmer-type.enum';
import { DashboardPagesService } from '@shared/services/dashboard-pages.service';
import { finalize, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-purchased',
  templateUrl: './purchased.component.html',
  styleUrls: ['./purchased.component.less']
})
export class PurchasedComponent extends AppComponentBase implements OnInit {
  courses: CourseDto[] = [];
  isLoading = true;

  shimmerType = ShimmerType;

  constructor(
    injector: Injector,
    private _dashboardPageService: DashboardPagesService,
    private _coursesService: CoursesServiceProxy
  ) {
    super(injector);
  }

  get isLoading$() { return this._dashboardPageService.isLoading$; }

  ngOnInit(): void {
    this.initCourses();
  }

  private initCourses(): void {
    this.isLoading = true;
    this._coursesService.getEnrolledCoursesByUser(this.appSession.userId)
      .pipe(takeUntil(this.destroyed$))
      .pipe(finalize((): boolean => this.isLoading = false))
      .subscribe(courses => {
        this.courses = courses;
        console.warn(courses);
      });
  }
}
