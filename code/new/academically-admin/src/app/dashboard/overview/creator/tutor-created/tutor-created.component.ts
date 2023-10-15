import { Component, Injector, OnInit } from '@angular/core';
import { finalize, takeUntil } from 'rxjs/operators';

import { AppComponentBase } from '@shared/app-component-base';
import { ShimmerType } from '@shared/enums/shimmer/shimmer-type.enum';
import {
  ArticleDto,
  ArticlesServiceProxy,
  ArticleStatus,
  CoachingDto,
  CoachingsServiceProxy,
  CoachingStatus,
  CourseDto,
  CoursesServiceProxy,
  CourseStatus,
  EventDto,
  EventsServiceProxy,
  EventStatus,
  VideoDto,
  VideosServiceProxy,
  VideoStatus
} from '@shared/service-proxies/service-proxies';
import { DashboardPagesService } from '@shared/services/dashboard-pages.service';

@Component({
  selector: 'app-tutor-created',
  templateUrl: './tutor-created.component.html',
  styleUrls: ['./tutor-created.component.less']
})
export class TutorCreatedComponent extends AppComponentBase implements OnInit {
  courses: CourseDto[] = [];
  articles: ArticleDto[] = [];
  coaching: CoachingDto[] = [];
  events: EventDto[] = [];
  videos: VideoDto[] = [];

  isLoading = true;
  shimmerType = ShimmerType;

  constructor(
    injector: Injector,
    private _dashboardPageService: DashboardPagesService,
    private _coursesService: CoursesServiceProxy,
    private _articlesService: ArticlesServiceProxy,
    private _coachingsService: CoachingsServiceProxy,
    private _eventsService: EventsServiceProxy,
    private _videosService: VideosServiceProxy
  ) {
    super(injector);
  }

  get isLoading$() { return this._dashboardPageService.isLoading$; }
  get userId(): number { return this.appSession.userId; }

  ngOnInit(): void {
    this.initCreatedCourses();
    this.initCreatedArticles();
    this.initCreatedCoachings();
    this.initCreatedEvents();
    this.initCreatedVideos();
  }

  private initCreatedCourses(): void {
    this._dashboardPageService.isLoading$.next(true);
    this._coursesService.getAll(this.appSession.userId, undefined, CourseStatus.Published, undefined, undefined, 3)
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
    this._articlesService.getAll(this.appSession.userId, undefined, ArticleStatus.Published, undefined, undefined, 3)
      .pipe(takeUntil(this.destroyed$))
      .pipe(finalize(() => this._dashboardPageService.isLoading$.next(false)))
      .subscribe(articles => {
        this.articles = articles.items;
      });
  }

  private initCreatedCoachings(): void {
    this._dashboardPageService.isLoading$.next(true);
    this._coachingsService.getAll(undefined, this.userId, undefined, CoachingStatus.Published, undefined, undefined, 3)
      .pipe(takeUntil(this.destroyed$))
      .pipe(finalize(() => this._dashboardPageService.isLoading$.next(false)))
      .subscribe(coachings => {
        this.coaching = coachings.items;
      });
  }

  private initCreatedEvents(): void {
    this._dashboardPageService.isLoading$.next(true);
    this._eventsService.getAll(undefined, this.userId, undefined, true, true, EventStatus.Published, undefined, undefined, 3)
      .pipe(takeUntil(this.destroyed$))
      .pipe(finalize(() => this._dashboardPageService.isLoading$.next(false)))
      .subscribe(events => {
        this.events = events.items;
      });
  }

  private initCreatedVideos(): void {
    this._dashboardPageService.isLoading$.next(true);
    this._videosService.getAll(this.userId, undefined, VideoStatus.Published, undefined, 3)
      .pipe(takeUntil(this.destroyed$))
      .pipe(finalize(() => this._dashboardPageService.isLoading$.next(false)))
      .subscribe(videos => {
        this.videos = videos.items;
      });
  }
}
