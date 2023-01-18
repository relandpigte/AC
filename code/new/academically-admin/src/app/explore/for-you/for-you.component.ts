import { Component, Injector, OnInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { ArticleDto, ArticlesServiceProxy, CoachingDto, CoachingsServiceProxy, CourseDto, CoursesServiceProxy, DateGrains, EventDto, EventsServiceProxy, PostsServiceProxy, UserDto, UserServiceProxy, VideoDto, VideosServiceProxy } from '@shared/service-proxies/service-proxies';

import { Router } from '@angular/router';
import { finalize, takeUntil } from 'rxjs/operators';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { UpsertPostComponent } from '@shared/modals/upsert-post/upsert-post.component';

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

  isLoading_newUsers = true;
  isLoading_upcomingEvents = true;
  isLoading_recommendedCourses = true;
  isLoading_newArticles = true;
  isLoading_recommendedTutorials = true;
  isLoading_newCoachings = true;

  isLoadingService = false;

  newUsersMaxItems: number = 0;
  upcomingEventsMaxItems: number = 0;
  recommendedCoursesMaxItems: number = 0;
  newArticlesMaxItems: number = 0;
  recommendedTutorialsMaxItems: number = 0;
  newCoachingsMaxItems: number = 0;

  constructor(
    injector: Injector,
    private _router: Router,
    private _modalService: BsModalService,
    private _usersService: UserServiceProxy,
    private _eventsService: EventsServiceProxy,
    private _coursesService: CoursesServiceProxy,
    private _articlesService: ArticlesServiceProxy,
    private _videoService: VideosServiceProxy,
    private _coachingsService: CoachingsServiceProxy,
    private _postsService: PostsServiceProxy
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.loadInfiniteData(this._usersService, 'getAll', ['', true, 'creationTime desc', 0, 6], 'newUsers');
    this.loadInfiniteData(this._eventsService, 'getByDates', [this.appSession.userId, undefined, undefined, undefined, DateGrains.Aged30, 0, 4], 'upcomingEvents');
    this.loadInfiniteData(this._coursesService, 'getByDates', [this.appSession.userId, undefined, undefined, undefined, DateGrains.Aged30, 0, 4], 'recommendedCourses');
    this.loadInfiniteData(this._articlesService, 'getByDates', [this.appSession.userId, undefined, undefined, undefined, DateGrains.Aged30, 0, 4], 'newArticles');
    this.loadInfiniteData(this._videoService, 'getByDates', [this.appSession.userId, undefined, undefined, undefined, DateGrains.Aged30, 0, 4], 'recommendedTutorials');
    this.loadInfiniteData(this._coachingsService, 'getByDates', [this.appSession.userId, undefined, undefined, undefined, DateGrains.Aged30, 0, 4], 'newCoachings');
  }

  handleNewUsersRequestData(skipCount: number): void {
    this.loadInfiniteData(this._usersService, 'getAll', ['', true, 'creationTime desc', skipCount, 6], 'newUsers');
  }

  handleUpcomingEventsRequestData(skipCount: number): void {
    const lastItem = this.upcomingEvents.slice(-1)[0];
    this.loadInfiniteData(this._eventsService, 'getByDates', [this.appSession.userId, undefined, lastItem.creationTime, undefined, DateGrains.Aged30, skipCount, 4], 'upcomingEvents');
  }

  handleRecommendedCoursesRequestData(skipCount: number): void {
    const lastItem = this.recommendedCourses.slice(-1)[0];
    this.loadInfiniteData(this._coursesService, 'getByDates', [this.appSession.userId, undefined, lastItem.creationTime, undefined, DateGrains.Aged30, skipCount, 4], 'recommendedCourses');
  }

  handleNewArticlesRequestData(skipCount: number): void {
    const lastItem = this.newArticles.slice(-1)[0];
    this.loadInfiniteData(this._articlesService, 'getByDates', [this.appSession.userId, undefined, undefined, undefined, DateGrains.Aged30, skipCount, 4], 'newArticles');
  }

  handleRecommendedTutorialsRequestData(skipCount: number): void {
    const lastItem = this.recommendedTutorials.slice(-1)[0];
    this.loadInfiniteData(this._videoService, 'getByDates', [this.appSession.userId, undefined, undefined, undefined, DateGrains.Aged30, skipCount, 4], 'recommendedTutorials');
  }

  handleNewCoachingsRequestData(skipCount: number): void {
    const lastItem = this.newCoachings.slice(-1)[0];
    this.loadInfiniteData(this._coachingsService, 'getByDates', [this.appSession.userId, undefined, undefined, undefined, DateGrains.Aged30, skipCount, 4], 'newCoachings');
  }

  handleEventServiceCardClick(event: EventDto): void {
    this._router.navigate(['/app/dashboard/events/portal/broadcast/student', event.id, 'portal']);
  }

  handleCourseServiceCardClick(course: CourseDto): void {
    this._router.navigate(['app/student-portal' , course.id]);
  }

  handleArticleServiceCardClick(article: ArticleDto): void {
    this._router.navigate(['/app/articles/student-portal', article.id]);
  }

  handleTutorialServiceCardClick(tutorial: VideoDto): void {
    this._router.navigate(['app/videos/student-portal' , tutorial.id]);
  }

  handleNewCoachingServiceCardClick(coaching: CoachingDto): void {
    this._router.navigate(['app/coachings/student-portal' , coaching.id]);
  }

  handleServiceCardShareClick(service: any): void {
    this.isLoadingService = true;
    this._postsService.getAvailableService(service.id)
      .pipe(takeUntil(this.destroyed$))
      .pipe(finalize(() => this.isLoadingService = false))
      .subscribe(service => {
        const modalSettings = this.defaultModalSettings as ModalOptions<UpsertPostComponent>;
        modalSettings.class = 'modal-lg';
        modalSettings.initialState = {
          allowTabs: false,
          canRemoveAttachment: false,
          title: 'Community.SharePost',
          activeTab: 'quick-post',
          model: { serviceId: service.id },
          selectedService: service
        };
        this._modalService.show(UpsertPostComponent, modalSettings).content;
      });
  }

}
