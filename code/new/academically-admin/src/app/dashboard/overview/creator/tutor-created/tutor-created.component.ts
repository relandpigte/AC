import { Component, Injector, OnInit } from '@angular/core';
import { finalize, takeUntil } from 'rxjs/operators';

import { AppComponentBase } from '@shared/app-component-base';
import { ShimmerType } from '@shared/enums/shimmer/shimmer-type.enum';
import { ArticleDto, ArticlesServiceProxy, ArticleStatus, CourseDto, CoursesServiceProxy, CourseStatus } from '@shared/service-proxies/service-proxies';
import { DashboardPagesService } from '@shared/services/dashboard-pages.service';

@Component({
  selector: 'app-tutor-created',
  templateUrl: './tutor-created.component.html',
  styleUrls: ['./tutor-created.component.less']
})
export class TutorCreatedComponent extends AppComponentBase implements OnInit {
  courses: CourseDto[] = [];
  articles: ArticleDto[] = [];

  isLoading = true;
  shimmerType = ShimmerType;

  constructor(
    injector: Injector,
    private _dashboardPageService: DashboardPagesService,
    private _coursesService: CoursesServiceProxy,
    private _articlesService: ArticlesServiceProxy
  ) {
    super(injector);
  }

  get isLoading$() { return this._dashboardPageService.isLoading$; }
  get userId(): number { return this.appSession.userId; }

  ngOnInit(): void {
    this.initCreatedCourses();
    this.initCreatedArticles();
  }

  private initCreatedCourses(): void {
    this._dashboardPageService.isLoading$.next(true);
    this._coursesService.getAll(this.appSession.userId, undefined, CourseStatus.Published, undefined, undefined, 2)
      .pipe(takeUntil(this.destroyed$))
      .pipe(finalize((): void => {
        this._dashboardPageService.isLoading$.next(false);
      }))
      .subscribe(courses => {
        this.courses = courses.items;
      });
  }

  private initCreatedArticles(): void {
    this._dashboardPageService.isLoading$.next(true);
    this._articlesService.getAll(this.appSession.userId, undefined, ArticleStatus.Published, undefined, undefined, 1)
      .pipe(takeUntil(this.destroyed$))
      .pipe(finalize(() => this._dashboardPageService.isLoading$.next(false)))
      .subscribe(articles => {
        this.articles = articles.items;
      });
  }
}
