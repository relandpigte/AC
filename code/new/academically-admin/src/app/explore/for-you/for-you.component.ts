import { Component, Injector, OnInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { ArticleDto, ArticlesServiceProxy, ArticleStatus, CoachingDto, CoachingsServiceProxy, CoachingStatus, CourseDto, CoursesServiceProxy, DateGrains, EventDto, EventsServiceProxy, UserDto, UserServiceProxy, VideoDto, VideosServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize, takeUntil } from 'rxjs/operators';

import * as _ from 'lodash';

@Component({
  selector: 'app-explore-for-you',
  templateUrl: './for-you.component.html',
  styleUrls: ['./for-you.component.less'],
  animations: [appModuleAnimation()],
})
export class ExploreForYouComponent extends AppComponentBase implements OnInit {

  newUsers: UserDto[] = Array(5).fill([]).map(() => this.generateRandomUser()) as UserDto[];
  upcomingEvents: EventDto[] = Array(4).fill([]).map(() => this.generateRandomEvent()) as EventDto[];
  recommendedCourses: CourseDto[] = Array(4).fill([]).map(() => this.generateRandomCourse()) as CourseDto[];
  newArticles: ArticleDto[] =  Array(4).fill([]).map(() => this.generateRandomArticle()) as ArticleDto[];
  recommendedTutorials: VideoDto[] = Array(4).fill([]).map(() => this.generateRandomTutorial()) as VideoDto[];
  newCoachings: CoachingDto[] = Array(4).fill([]).map(() => this.generateRandomCoaching()) as CoachingDto[];

  isLoadingNewUsers = true;
  isLoadingUpcomingEvents = true;
  isLoadingRecommendedCourses = true;
  isLoadingNewArticles = true;
  isLoadingRecommendedTutorials = true;
  isLoadingNewCoachings = true;

  constructor(
    injector: Injector,
    private _usersService: UserServiceProxy,
    private _eventsService: EventsServiceProxy,
    private _coursesService: CoursesServiceProxy,
    private _articlesService: ArticlesServiceProxy,
    private _videoService: VideosServiceProxy,
    private _coachingsService: CoachingsServiceProxy
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.loadNewUsers();
    this.loadUpcomingEvents();
    this.loadRecommendedCourses();
    this.loadNewArticles();
    this.loadRecommendedTutorials();
    this.loadNewCoachings();
  }

  private loadNewUsers(): void {
    this.isLoadingNewUsers = true;
    this._usersService.getAll('', true, 'creationTime desc', 0, 10)
      .pipe(takeUntil(this.destroyed$))
      .pipe(finalize(() => this.isLoadingNewUsers = false))
      .subscribe(users => {
        this.newUsers = users?.items ?? [];
      });
  }

  private loadUpcomingEvents(): void {
    this.isLoadingUpcomingEvents = true;
    this._eventsService.getByDates(this.appSession.userId, undefined, undefined, undefined, DateGrains.Monthly, 0, 10)
      .pipe(takeUntil(this.destroyed$))
      .pipe(finalize(() => this.isLoadingUpcomingEvents = false))
      .subscribe(pagedEvents => {
        const events = pagedEvents;
        if (events) {
          this.upcomingEvents = [];
          Object.keys(events).forEach(range => {
            this.upcomingEvents = _.concat(this.upcomingEvents, events[range]?.items);
          });
        }
    });
  }

  private loadRecommendedCourses(): void {
    this.isLoadingRecommendedCourses = true;
    this._coursesService.getByDates(this.appSession.userId, undefined, undefined, undefined, DateGrains.Monthly, 0, 10)
      .pipe(takeUntil(this.destroyed$))
      .pipe(finalize(() => this.isLoadingRecommendedCourses = false))
      .subscribe(pagedCourses => {
        const courses = pagedCourses;
        if (courses) {
          this.recommendedCourses = [];
          Object.keys(courses).forEach(range => {
            this.recommendedCourses = _.concat(this.recommendedCourses, courses[range]?.items);
          });
        }
    });
  }

  private loadNewArticles(): void {
    this.isLoadingNewArticles = true;
    this._articlesService.getByDates(this.appSession.userId, undefined, undefined, undefined, DateGrains.Monthly, 0, 10)
      .pipe(takeUntil(this.destroyed$))
      .pipe(finalize(() => this.isLoadingNewArticles = false))
      .subscribe(articles => {
        if (articles) {
          this.newCoachings = [];
            Object.keys(articles).forEach(range => {
            this.newArticles =  _.concat(this.newArticles, articles[range]?.items);
          });
        }
      });
  }

  private loadRecommendedTutorials(): void {
    this.isLoadingRecommendedTutorials = true;
    this._videoService.getByDates(this.appSession.userId, undefined, undefined, undefined, DateGrains.Monthly, 0, 10)
      .pipe(takeUntil(this.destroyed$))
      .pipe(finalize(() => this.isLoadingRecommendedTutorials = false))
      .subscribe(pagedVideos => {
        const videos = pagedVideos;
        if (videos) {
          this.recommendedTutorials = [];
          Object.keys(videos).forEach(range => {
            this.recommendedTutorials =  _.concat(this.recommendedTutorials, videos[range]?.items);
          });
        }
    });
  }

  private loadNewCoachings(): void {
    this.isLoadingNewCoachings = true;
    this._coachingsService.getByDates(this.appSession.userId, undefined, undefined, undefined, DateGrains.Monthly, 0, 10)
      .pipe(takeUntil(this.destroyed$))
      .pipe(finalize(() => this.isLoadingNewCoachings = false))
      .subscribe(coachings => {
        if (coachings) {
          this.newCoachings = [];
            Object.keys(coachings).forEach(range => {
            this.newCoachings =  _.concat(this.newCoachings, coachings[range]?.items);
          });
        }
      });
  }

}
