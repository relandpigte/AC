import { Component, Injector, OnInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import {
  ArticleDto,
  ArticlesServiceProxy,
  CoachingDto,
  CoachingsServiceProxy,
  CourseDto,
  CoursesServiceProxy,
  CreateUserTopicDto,
  DateGrains,
  DisciplineTaxonomiesServiceProxy,
  DisciplineTaxonomyDto,
  EventDto,
  EventsServiceProxy,
  SearchDisciplineTaxonomyRequestDto,
  UserDto,
  UserFollowersServiceProxy,
  UserTopicDto,
  UserTopicType,
  UserTopicsServiceProxy,
  VideoDto,
  VideosServiceProxy,
} from "@shared/service-proxies/service-proxies";
import { finalize, switchMap, takeUntil } from 'rxjs/operators';

import { Router } from '@angular/router';
import { TopicSorting } from '@shared/components/topic/topic.component';
import { AddTopicsComponent } from '@shared/modals/add-topics/add-topics.component';
import { UserFollowingService } from '@shared/services/user-following.service';
import * as _ from 'lodash';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ShimmerType } from '../../shared/enums/shimmer/shimmer-type.enum';
import { UpsertPostComponent } from '../../shared/modals/upsert-post/upsert-post.component';
import { CommunityService } from './community.service';
import { BehaviorSubject, combineLatest, of } from 'rxjs';
import { WrapperService } from '@shared/services/wrapper.service';

@Component({
  selector: "app-community",
  templateUrl: "./community.component.html",
  styleUrls: ["./community.component.less"],
  animations: [appModuleAnimation()],
  providers: [CommunityService],
})
export class CommunityComponent extends AppComponentBase implements OnInit {
  differ: any;
  userTopics: UserTopicDto[] = [];
  selectedTopics: string[] = [];

  isLoadingCommunity$ = new BehaviorSubject<boolean>(true);
  isLoadingSuggestTopics$ = new BehaviorSubject<boolean>(true);
  isLoadingPeopleToFollow$ = new BehaviorSubject<boolean>(true);
  isLoadingRecommendedCourses$ = new BehaviorSubject<boolean>(true);
  isLoadingRecommendedCoachings$ = new BehaviorSubject<boolean>(true);
  isLoadingRecommendedArticles$ = new BehaviorSubject<boolean>(true);
  isLoadingRecommendedEvents$ = new BehaviorSubject<boolean>(true);
  isLoadingRecommendedTutorials$ = new BehaviorSubject<boolean>(true);

  suggestedTopics: DisciplineTaxonomyDto[] = Array(4)
    .fill([])
    .map(() => this.generateRandomTopic()) as DisciplineTaxonomyDto[];
  peopleToFollow: UserDto[] = Array(4)
    .fill([])
    .map(() => this.generateRandomUser()) as UserDto[];
  recommendedCourses: CourseDto[] = Array(4)
    .fill([])
    .map(() => this.generateRandomCourse()) as CourseDto[];
  recommendedCoachings: CoachingDto[] = Array(4)
    .fill([])
    .map(() => this.generateRandomCoaching()) as CoachingDto[];
  recommendedArticles: ArticleDto[] = Array(4)
    .fill([])
    .map(() => this.generateRandomArticle()) as ArticleDto[];
  recommendedEvents: EventDto[] = Array(4)
    .fill([])
    .map(() => this.generateRandomEvent()) as EventDto[];
  recommendedTutorials: VideoDto[] = Array(4)
    .fill([])
    .map(() => this.generateRandomTutorial()) as VideoDto[];

  topicLoaders: Map<
    string,
    { isFollowingTopic?: boolean; isUnfollowingTopic?: boolean }
  > = new Map();

  getUserTopics$ = () => {
    return this._userTopicsService
      .getAll(
        undefined,
        this.appSession.userId,
        UserTopicType.Following,
        undefined
      )
      .pipe(takeUntil(this.destroyed$))
      .pipe(finalize(() => (this.isLoadingSuggestTopics$.next(false))));
  };

  constructor(
    injector: Injector,
    private _router: Router,
    private _modalService: BsModalService,
    private _wrapperService: WrapperService,
    private _taxonomyService: DisciplineTaxonomiesServiceProxy,
    private _userTopicsService: UserTopicsServiceProxy,
    private _coursesService: CoursesServiceProxy,
    private _coachingService: CoachingsServiceProxy,
    private _articlesService: ArticlesServiceProxy,
    private _eventsService: EventsServiceProxy,
    private _videosService: VideosServiceProxy,
    private _userFollowersService: UserFollowersServiceProxy,
    private _communityService: CommunityService,
    private _userFollowingService: UserFollowingService
  ) {
    super(injector);
  }

  get isDiscussion(): boolean {
    return this._router.url.includes(["community", "discussion"].join("/"));
  }
  get shimmerType() {
    return ShimmerType;
  }
  get isLoading$() {
    return combineLatest([
      this.isLoadingCommunity$,
      this.isLoadingPeopleToFollow$,
      this.isLoadingRecommendedArticles$,
      this.isLoadingRecommendedCoachings$,
      this.isLoadingRecommendedCourses$,
      this.isLoadingRecommendedEvents$,
      this.isLoadingRecommendedTutorials$,
      this.isLoadingSuggestTopics$
    ]).pipe(switchMap((loaders) => of(loaders.some(l => l))));
  }

  ngOnInit(): void {
    this.getUserTopics();
    this.getSuggestedTopics();
    this.getPeopleToFollow();
    this.getRecommendedCourses();
    this.getRecommendedCoachings();
    this.getRecommendedArticles();
    this.getRecommendedEvents();
    this.getRecommendedTutorials();

    this._communityService.getIsLoading().subscribe((isLoading) => this.isLoadingCommunity$.next(isLoading));
    this.isLoading$.pipe(takeUntil(this.destroyed$)).subscribe(isLoading => this._wrapperService.toggleCanScroll(!isLoading));
  }

  isTopicLoading(id: string, property?: string): boolean {
    const topicLoaders = this.topicLoaders.get(id);
    if (!topicLoaders) return false;
    if (property) return topicLoaders[property];
    else return Object.keys(topicLoaders).some((p) => topicLoaders[p]);
  }

  setTopicLoading(id: string, property: string, value: boolean): void {
    if (!this.topicLoaders.has(id)) this.topicLoaders.set(id, {});
    const topicLoaders = this.topicLoaders.get(id);
    topicLoaders[property] = value;
    if (Object.keys(topicLoaders).every((p) => !topicLoaders[p]))
      this.topicLoaders.delete(id);
  }

  handleFilterTopics(topics: string[]): void {
    this.selectedTopics = topics;
    this._communityService.setSelectedTopics(topics);
  }

  handleViewAllClick(type: string): void {
    switch (type) {
      case "topics":
        break;
      default:
        this._router.navigate(["app", "explore", type]);
    }
  }

  handleItemClick(type: string, item: any): void {
    switch (type) {
      case "topics":
        break;
      case "users":
        break;
      case "courses":
        break;
      case "coachings":
        break;
      case "articles":
        break;
      case "events":
        break;
      case "tutorials":
        break;
    }
  }

  handleAddPost(tab: string): void {
    const modalSettings = this
      .defaultModalSettings as ModalOptions<UpsertPostComponent>;
    modalSettings.class = "modal-lg";
    modalSettings.initialState = { activeTab: tab };

    const modal = this._modalService.show(
      UpsertPostComponent,
      modalSettings
    ).content;
  }

  handleAddTopics(): void {
    const modalSettings = this
      .defaultModalSettings as ModalOptions<AddTopicsComponent>;
    modalSettings.class = "modal-lg";

    const modal = this._modalService.show(
      AddTopicsComponent,
      modalSettings
    ).content;
  }

  handleOnFollowTopic(topic: DisciplineTaxonomyDto): void {
    this.setTopicLoading(topic.id, "isFollowingTopic", true);

    const request = new CreateUserTopicDto();
    request.userId = this.appSession.userId;
    request.disciplineTaxonomyId = topic.id;
    request.type = UserTopicType.Following;

    this._userTopicsService
      .create(request)
      .pipe(switchMap(() => this.getUserTopics$()))
      .pipe(takeUntil(this.destroyed$))
      .pipe(
        finalize(() =>
          this.setTopicLoading(topic.id, "isFollowingTopic", false)
        )
      )
      .subscribe((topics) => {
        this.userTopics = topics.filter((x) => x);
        this.suggestedTopics.forEach((t) => {
          if (t.id === topic.id) t.userTopics.push(request as UserTopicDto);
        });
      });
  }

  handleOnUnfollowTopic(topic: DisciplineTaxonomyDto): void {
    this.setTopicLoading(topic.id, "isUnfollowingTopic", true);

    const userTopic = Array.from(this.userTopics.values()).find(
      (t) => t.disciplineTaxonomyId === topic.id
    );

    this._userTopicsService
      .delete(userTopic.id)
      .pipe(switchMap(() => this.getUserTopics$()))
      .pipe(takeUntil(this.destroyed$))
      .pipe(
        finalize(() =>
          this.setTopicLoading(topic.id, "isUnfollowingTopic", false)
        )
      )
      .subscribe((topics) => {
        this.userTopics = topics.filter((x) => x);
        this.suggestedTopics.forEach((t) => {
          if (t.id === topic.id)
            t.userTopics = t.userTopics.filter(
              (t) => t.disciplineTaxonomyId !== topic.id
            );
        });
      });
  }

  getCourseThumbnail(course: CourseDto): string {
    return course.thumbnailImageUrl ?? "assets/img/img-placeholder.png";
  }

  getArticleAuthorAvatar(article: ArticleDto): string {
    return article.creatorUser?.profilePictureUrl ?? "assets/img/anonymous.png";
  }

  getEventThumbnail(event: EventDto): string {
    return event.thumbnailImageUrl ?? "assets/img/img-placeholder.png";
  }

  getCourseComposition(course: CourseDto): string {
    const modules = course?.modules ? `${course?.modules} modules` : null;
    const lessons = course?.lessons ? `${course?.lessons} lessons` : null;
    const values = [modules, lessons].filter((x) => x);
    return values?.length ? values.join(" • ") : "no lessons";
  }

  getUserTopics(): void {
    this.getUserTopics$().subscribe(
      (topics) => (this.userTopics = topics.filter((x) => x))
    );
  }

  getSuggestedTopics(): void {
    const request = new SearchDisciplineTaxonomyRequestDto();
    request.keyword = undefined;
    request.excludeFollowing = true;
    request.sorting = TopicSorting.Popular;
    request.take = 4;

    this._taxonomyService
      .search(request)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isLoadingSuggestTopics$.next(false);
        })
      )
      .subscribe((topics) => (this.suggestedTopics = topics));
  }

  getPeopleToFollow(): void {
    this._userFollowersService
      .getUsersToFollow()
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isLoadingPeopleToFollow$.next(false);
        })
      )
      .subscribe((users) => {
        this.peopleToFollow = users ?? [];
        this.peopleToFollow = _.take(this.peopleToFollow, 4);
      });
  }

  getRecommendedCourses(): void {
    this._coursesService
      .getByDates(
        this.appSession.userId,
        undefined,
        undefined,
        undefined,
        DateGrains.Aged30,
        undefined,
        0,
        4
      )
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isLoadingRecommendedCourses$.next(false);
        })
      )
      .subscribe((pagedCourses) => {
        const courses = pagedCourses;
        if (courses) {
          this.recommendedCourses = [];
          Object.keys(courses).forEach((range) => {
            this.recommendedCourses = _.concat(
              this.recommendedCourses,
              courses[range]?.items
            );
            this.recommendedCourses = _.take(this.recommendedCourses, 4);
          });
        }
      });
  }

  getRecommendedCoachings(): void {
    this._coachingService
      .getByDates(
        this.appSession.userId,
        undefined,
        undefined,
        undefined,
        DateGrains.Aged30,
        undefined,
        0,
        4
      )
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isLoadingRecommendedCoachings$.next(false);
        })
      )
      .subscribe((pagedCoachings) => {
        const coachings = pagedCoachings;
        if (coachings) {
          this.recommendedCoachings = [];
          Object.keys(coachings).forEach((range) => {
            this.recommendedCoachings = _.concat(
              this.recommendedCoachings,
              coachings[range]?.items
            );
            this.recommendedCoachings = _.take(this.recommendedCoachings, 4);
          });
        }
      });
  }

  getRecommendedArticles(): void {
    this._articlesService
      .getByDates(
        this.appSession.userId,
        undefined,
        undefined,
        undefined,
        DateGrains.Aged30,
        undefined,
        0,
        4
      )
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isLoadingRecommendedArticles$.next(false);
        })
      )
      .subscribe((pagedArticles) => {
        const articles = pagedArticles;
        if (articles) {
          this.recommendedArticles = [];
          Object.keys(articles).forEach((range) => {
            this.recommendedArticles = _.concat(
              this.recommendedArticles,
              articles[range]?.items
            );
            this.recommendedArticles = _.take(this.recommendedArticles, 4);
          });
        }
      });
  }

  getRecommendedEvents(): void {
    this._eventsService
      .getByDates(
        this.appSession.userId,
        undefined,
        undefined,
        undefined,
        DateGrains.Aged30,
        undefined,
        0,
        4
      )
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isLoadingRecommendedEvents$.next(false);
        })
      )
      .subscribe((pagedEvents) => {
        const events = pagedEvents;
        if (events) {
          this.recommendedEvents = [];
          Object.keys(events).forEach((range) => {
            this.recommendedEvents = _.concat(
              this.recommendedEvents,
              events[range]?.items
            );
            this.recommendedEvents = _.take(this.recommendedEvents, 4);
          });
        }
      });
  }

  getRecommendedTutorials(): void {
    this._videosService
      .getByDates(
        this.appSession.userId,
        undefined,
        undefined,
        undefined,
        DateGrains.Aged30,
        undefined,
        0,
        4
      )
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isLoadingRecommendedTutorials$.next(false);
        })
      )
      .subscribe((pagedTutorials) => {
        const tutorials = pagedTutorials;
        if (tutorials) {
          this.recommendedTutorials = [];
          Object.keys(tutorials).forEach((range) => {
            this.recommendedTutorials = _.concat(
              this.recommendedTutorials,
              tutorials[range]?.items
            );
            this.recommendedTutorials = _.take(this.recommendedTutorials, 4);
          });
        }
      });
  }

  isTopicFollowed(topic: DisciplineTaxonomyDto): boolean {
    return topic?.userTopics?.some(
      (u) =>
        u.userId === this.appSession.userId &&
        u.type === UserTopicType.Following
    );
  }

  isUserFollowing(user: UserDto): boolean {
    return this._userFollowingService.isUserFollowing(user);
  }

  isUserLoading(userId: number): boolean {
    return this._userFollowingService.isUserLoading(userId.toString());
  }

  handleUserFollow(user: UserDto): void {
    if (this.isUserFollowing(user)) {
      this._userFollowingService.onUnFollowUser(user);
    } else {
      this._userFollowingService.onFollowUser(user);
    }
  }
}
