import { Component, Injector, OnInit } from '@angular/core';
import { finalize, takeUntil } from 'rxjs/operators';
import * as _ from 'lodash';

import { AppComponentBase } from '@shared/app-component-base';
import { ShimmerType } from '@shared/enums/shimmer/shimmer-type.enum';
import {
  ArticleDto,
  ArticlesServiceProxy,
  CourseDto,
  CoursesServiceProxy
} from '@shared/service-proxies/service-proxies';
import { DashboardPagesService } from '@shared/services/dashboard-pages.service';

@Component({
  selector: 'app-tutor-created',
  templateUrl: './tutor-created.component.html',
  styleUrls: ['./tutor-created.component.less']
})
export class TutorCreatedComponent extends AppComponentBase implements OnInit {
  courses: CourseDto[] = Array(this.getRndInteger(2, 4)).fill([]).map(() => this.generateRandomCourse()) as CourseDto[];
  articles: ArticleDto[] = Array(this.getRndInteger(1, 3)).fill([]).map(() => this.generateRandomArticle()) as ArticleDto[];
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

  ngOnInit(): void {
    this.initCreatedCourses();
    this.initCreatedArticles();
  }

  private initCreatedCourses(): void {
    this._dashboardPageService.isLoading$.next(true);
    this._coursesService.getAll(this.appSession.userId, undefined, undefined, undefined, undefined, undefined)
      .pipe(takeUntil(this.destroyed$))
      .pipe(finalize((): void => {
        this._dashboardPageService.isLoading$.next(false);
      }))
      .subscribe(courses => {
        this.courses = _.take(courses?.items, 2);
      });
  }

  private initCreatedArticles(): void {
    this._dashboardPageService.isLoading$.next(true);
    this._articlesService.getAll(this.appSession.userId, undefined, undefined, undefined, undefined, undefined)
      .pipe(takeUntil(this.destroyed$))
      .pipe(finalize(() => this._dashboardPageService.isLoading$.next(false)))
      .subscribe(articles => {
        this.articles = _.take(articles?.items, 1);
      });
  }
}
