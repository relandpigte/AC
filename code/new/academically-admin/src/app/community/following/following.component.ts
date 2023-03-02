import { ChangeDetectorRef, Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { HubService } from '@app/_shared/services/hub.service';
import { AppComponentBase } from '@shared/app-component-base';
import { CourseDto, CoursesServiceProxy, DateGrains, PostsServiceProxy, PostType, UserDto, UserServiceProxy } from '@shared/service-proxies/service-proxies';
import { PostsStateService } from '@shared/services/posts-state.service';
import { AppStateConfig, AppStateServices } from '@shared/services/pub-sub.service';
import { StateUpdateType } from '@shared/services/state-base.service';
import { takeUntil } from 'rxjs/operators';

enum PostFiltering {
  All = 'Community.Posts.Filtering.All',
  Post = 'Community.Posts.Filtering.Post',
  Question = 'Community.Posts.Filtering.Question',
  Discussion = 'Community.Posts.Filtering.Discussion'
}

enum PostSorting {
  Latest = 'Community.Posts.Sorting.Latest',
  Replied = 'Community.Posts.Sorting.Replied',
  Reacted = 'Community.Posts.Sorting.Reacted'
}

@Component({
  selector: 'app-following',
  templateUrl: './following.component.html',
  styleUrls: ['./following.component.less']
})
export class FollowingComponent extends AppComponentBase implements OnInit, OnDestroy {
  postsStateService: PostsStateService;

  posts: any[] = [];

  usersYouMayKnow: UserDto[] = Array(5).fill([]).map(() => this.generateRandomUser()) as UserDto[];
  recommendedCourses: CourseDto[] = Array(4).fill([]).map(() => this.generateRandomCourse()) as CourseDto[];

  isLoading_usersYouMayKnow = true;
  isLoading_recommendedCourses = true;
  isLoadingPosts = false;

  usersYouMayKnowMaxItems: number = 0;
  recommendedCoursesMaxItems: number = 0;

  postFilteringEnum = PostFiltering;
  postSortingEnum = PostSorting;

  selectedFiltering: PostFiltering = PostFiltering.All;
  selectedSorting: PostSorting = PostSorting.Latest;

  postsHub: any;

  constructor(
    injector: Injector,
    private _cdr: ChangeDetectorRef,
    private _hubService: HubService,
    private _usersService: UserServiceProxy,
    private _coursesService: CoursesServiceProxy,
    private _postsService: PostsServiceProxy,
  ) {
    super(injector);
  }

  get postsStateId(): string { return 'posts'; }
  get postTypeFilter(): PostType {
    switch(this.selectedFiltering) {
      case PostFiltering.All:
        return undefined;
      case PostFiltering.Post:
        return PostType.QuickPost;
      case PostFiltering.Question:
        return PostType.Question;
      case PostFiltering.Discussion:
        return PostType.Discussion;
    }
  }

  async ngOnInit() {
    this.loadInfiniteData(this._usersService, 'getAll', ['', true, 'creationTime desc', 0, 6], 'usersYouMayKnow');
    this.loadInfiniteData(this._coursesService, 'getByDates', [this.appSession.userId, undefined, undefined, undefined, DateGrains.Aged30, 0, 4], 'recommendedCourses');
    await this.initPostsAppStates();
  }

  ngOnDestroy() {
    this.pubSubService.stop();
  }

  private async initPostsAppStates() {
    const appStateConfig: AppStateConfig = { [this.postsStateId]: { load: true, update: true } };
    const appStateServices: AppStateServices = { [this.postsStateId]: { type: PostsStateService, args: [this._hubService, this._postsService] } };
    await this.pubSubService.start(this, appStateConfig, appStateServices);
    this.postsStateService = this.pubSubService.getStateService<PostsStateService>(this.postsStateId);

    this.postsStateService.loading$.pipe(takeUntil(this.destroyed$)).subscribe(loading => this.isLoadingPosts = loading);

    this.postsStateService.posts$.pipe(takeUntil(this.destroyed$)).subscribe(event => {
      if (this.postTypeFilter !== undefined && event.data.type !== this.postTypeFilter) return;
      switch(event.type) {
        case StateUpdateType.Add:
          this.posts = [event.data].concat(this.posts);
          break;
        case StateUpdateType.Update:
          this.posts = this.posts.map(p => p.id === event.data.id ? event.data : p);
          break;
        case StateUpdateType.Delete:
          this.posts = this.posts.filter(p => p.id != event.data.id);
          break;
      }
      this._cdr.detectChanges();
    });

    this.posts = this.postsStateService.getAllPosts();
  }

  handleRecommendedCoursesRequestData(skipCount: number): void {
    const lastItem = this.recommendedCourses.slice(-1)[0];
    this.loadInfiniteData(this._coursesService, 'getByDates', [this.appSession.userId, undefined, lastItem.creationTime, undefined, DateGrains.Aged30, skipCount, 4], 'recommendedCourses');
  }

  isSelectedFiltering(filter: PostFiltering): boolean {
    return this.selectedFiltering === filter;
  }

  isSelectedSorting(sort: PostSorting): boolean {
    return this.selectedSorting === sort;
  }

  handleFilteringChange(filter: PostFiltering): void {
    this.selectedFiltering = filter;
    this.posts = this.postsStateService.getPostsByType(this.postTypeFilter);
  }

  handleSortingChange(sort: PostSorting): void {
    this.selectedSorting = sort;
  }
}
