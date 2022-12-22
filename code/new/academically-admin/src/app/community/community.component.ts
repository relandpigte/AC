import { Component, Injector, OnInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { ArticleDto, ArticlesServiceProxy, CourseDto, CoursesServiceProxy, DateGrains, DisciplineTaxonomiesServiceProxy, DisciplineTaxonomyDto, EventDto, EventsServiceProxy, SearchDisciplineTaxonomyRequestDto, UserDto, UserServiceProxy, UserTopicDto, UserTopicsServiceProxy, UserTopicType, VideoDto, VideosServiceProxy } from '@shared/service-proxies/service-proxies';
import { takeUntil } from 'rxjs/operators';

import * as _ from 'lodash';
import { Router } from '@angular/router';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { AddTopicsComponent } from '@shared/modals/add-topics/add-topics.component';
import { AddPostComponent } from '../../shared/modals/add-post/add-post.component';
import { TopicSorting } from '@shared/components/topic/topic.component';

@Component({
  selector: 'app-community',
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.less'],
  animations: [appModuleAnimation()],
})
export class CommunityComponent extends AppComponentBase implements OnInit {

  userTopics: UserTopicDto[] = [];
  selectedTopics: string[] = [];
  suggestedTopics: DisciplineTaxonomyDto[] = [];
  peopleToFollow: UserDto[] = [];
  recommendedCourses: CourseDto[] = [];
  recommendedArticles: ArticleDto[] = [];
  recommendedEvents: EventDto[] = [];
  recommendedTutorials: VideoDto[] = [];

  constructor(
    injector: Injector,
    private _router: Router,
    private _modalService: BsModalService,
    private _taxonomyService: DisciplineTaxonomiesServiceProxy,
    private _userTopicsService: UserTopicsServiceProxy,
    private _usersService: UserServiceProxy,
    private _coursesService: CoursesServiceProxy,
    private _articlesService: ArticlesServiceProxy,
    private _eventsService: EventsServiceProxy,
    private _videosService: VideosServiceProxy
  ) {
    super(injector);
  }

  get isDiscussion(): boolean { return this._router.url.includes(['community', 'discussion'].join('/')) }

  ngOnInit(): void {
    this.getUserTopics();
    this.getSuggestedTopics();
    this.getPeopleToFollow();
    this.getRecommendedCourses();
    this.getRecommendedArticles();
    this.getRecommendedEvents();
    this.getRecommendedTutorials();
  }

  handleFilterTopics(topics: string[]): void {
    this.selectedTopics = topics;
  }

  handleViewAllClick(type: string): void {
    switch(type) {
      case 'topics':
        break;
      default:
        this._router.navigate(['app', 'explore', type]);
    }
  }

  handleItemClick(type: string, item: any): void {
    switch(type) {
      case 'topics':
        break;
      case 'user':
        break;
      case 'courses':
        break;
      case 'articles':
        break;
      case 'events':
        break;
      case 'tutorials':
        break;
    }
  }

  handleAddPost(tab: string): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<AddPostComponent>;
    modalSettings.class = 'modal-lg';
    modalSettings.initialState = { activeTab: tab };

    const modal = this._modalService.show(AddPostComponent, modalSettings).content;
  }

  handleAddTopics(): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<AddTopicsComponent>;
    modalSettings.class = 'modal-lg';

    const modal = this._modalService.show(AddTopicsComponent, modalSettings).content;
  }

  getCourseThumbnail(course: CourseDto): string {
    return course.thumbnailImageUrl ?? 'assets/img/img-placeholder.png';
  }

  getArticleAuthorAvatar(article: ArticleDto): string {
    return article.creatorUser?.profilePictureUrl ?? 'assets/img/anonymous.png';
  }

  getEventThumbnail(event: EventDto): string {
    return event.thumbnailImageUrl ?? 'assets/img/img-placeholder.png';
  }

  getCourseComposition(course: CourseDto): string {
    const modules = course?.modules ? `${course?.modules} modules` : null;
    const lessons = course?.lessons ? `${course?.lessons} lessons` : null;
    const values = [modules, lessons].filter(x => x);
    return values?.length ? values.join(', ') : 'no lessons';
  }

  getUserTopics(): void {
    this._userTopicsService.getAll(undefined, this.appSession.userId, UserTopicType.Following, undefined)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(topics => this.userTopics = topics.filter(x => x));
  }

  getSuggestedTopics(): void {
    const request = new SearchDisciplineTaxonomyRequestDto();
    request.keyword = undefined;
    request.excludeFollowing = true;
    request.sorting = TopicSorting.Popular;
    request.take = 4;

    this._taxonomyService.search(request)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(topics => this.suggestedTopics = topics);
  }

  getPeopleToFollow(): void {
    this._usersService.getAll('', true, 'creationTime desc', 0, 4)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(pagedUsers => {
        this.peopleToFollow = pagedUsers.items ?? [];
        this.peopleToFollow = _.take(this.peopleToFollow, 4);
      });
  }

  getRecommendedCourses(): void {
    this._coursesService.getByDates(this.appSession.userId, undefined, undefined, undefined, DateGrains.Aged30, 0, 4)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(pagedCourses => {
        const courses = pagedCourses;
        if (courses) {
          this.recommendedCourses = [];
          Object.keys(courses).forEach(range => {
            this.recommendedCourses = _.concat(this.recommendedCourses, courses[range]?.items);
            this.recommendedCourses = _.take(this.recommendedCourses, 4);
          });
        }
      });
  }

  getRecommendedArticles(): void {
    this._articlesService.getByDates(this.appSession.userId, undefined, undefined, undefined, DateGrains.Aged30, 0, 4)
    .pipe(takeUntil(this.destroyed$))
    .subscribe(pagedArticles => {
      const articles = pagedArticles;
      if (articles) {
        this.recommendedArticles = [];
        Object.keys(articles).forEach(range => {
          this.recommendedArticles = _.concat(this.recommendedArticles, articles[range]?.items);
          this.recommendedArticles = _.take(this.recommendedArticles, 4);
        });
      }
    });
  }

  getRecommendedEvents(): void {
    this._eventsService.getByDates(this.appSession.userId, undefined, undefined, undefined, DateGrains.Aged30, 0, 4)
    .pipe(takeUntil(this.destroyed$))
    .subscribe(pagedEvents => {
      const events = pagedEvents;
      if (events) {
        this.recommendedEvents = [];
        Object.keys(events).forEach(range => {
          this.recommendedEvents = _.concat(this.recommendedEvents, events[range]?.items);
          this.recommendedEvents = _.take(this.recommendedEvents, 4);
        });
      }
    });
  }

  getRecommendedTutorials(): void {
    this._videosService.getByDates(this.appSession.userId, undefined, undefined, undefined, DateGrains.Aged30, 0, 4)
    .pipe(takeUntil(this.destroyed$))
    .subscribe(pagedTutorials => {
      const tutorials = pagedTutorials;
      if (tutorials) {
        this.recommendedTutorials = [];
        Object.keys(tutorials).forEach(range => {
          this.recommendedTutorials = _.concat(this.recommendedTutorials, tutorials[range]?.items);
          this.recommendedTutorials = _.take(this.recommendedTutorials, 4);
        });
      }
    });
  }

}
