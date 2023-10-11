import { Component, Injector, OnInit } from '@angular/core';
import { finalize, takeUntil } from 'rxjs/operators';
import * as _ from 'lodash';
import { Router } from '@angular/router';

import { AppComponentBase } from '@shared/app-component-base';
import { ShimmerType } from '@shared/enums/shimmer/shimmer-type.enum';
import { ArticleDto, CourseDto, CoursesServiceProxy } from '@shared/service-proxies/service-proxies';
import { DashboardPagesService } from '@shared/services/dashboard-pages.service';

@Component({
  selector: 'app-student-learning',
  templateUrl: './student-learning.component.html',
  styleUrls: ['./student-learning.component.less']
})
export class StudentLearningComponent extends AppComponentBase implements OnInit {
  courses: CourseDto[] = [];
  articles: ArticleDto[] = [];
  isLoading = true;

  shimmerType = ShimmerType;

  constructor(
    injector: Injector,
    private _dashboardPageService: DashboardPagesService,
    private _coursesService: CoursesServiceProxy,
    private _router: Router
  ) {
    super(injector);
  }

  get isLoading$() { return this._dashboardPageService.isLoading$; }

  ngOnInit(): void {
    this.initCourses();
  }

  async handleCourseClickAction(id: string): Promise<void> {
    await this._router.navigate(['app/student-portal' , id]);
  }

  private initCourses(): void {
    this._dashboardPageService.isLoading$.next(true);
    this._coursesService.getEnrolledCoursesByUser()
      .pipe(takeUntil(this.destroyed$))
      .pipe(finalize(() => this._dashboardPageService.isLoading$.next(false)))
      .subscribe((courses: CourseDto[]): void => {
        this.courses = _.take(courses.filter(c => c.progress < 100), 3);
      });
  }
}
