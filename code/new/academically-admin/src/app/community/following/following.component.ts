import { ChangeDetectorRef, Component, Injector, OnDestroy, OnInit, ViewChildren } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { switchMap, takeUntil } from 'rxjs/operators';

import { Router } from '@angular/router';
import { HubService } from '@app/_shared/services/hub.service';
import { AppComponentBase } from '@shared/app-component-base';
import { UpsertPostComponent } from '@shared/modals/upsert-post/upsert-post.component';
import { CourseDto, CoursesServiceProxy, DateGrains, PostDto, PostSort, PostsServiceProxy, PostType, SharedType, UserDto, UserServiceProxy } from '@shared/service-proxies/service-proxies';
import { MAX_POSTS_TO_LOAD, PostsStateService } from '@shared/services/posts-state.service';
import { AppStateConfig, AppStateServices } from '@shared/services/pub-sub.service';
import { StateUpdateType } from '@shared/services/state-base.service';
import { BehaviorSubject, combineLatest, of } from 'rxjs';
import { CommunityService } from '../community.service';
import { CommunityPostCardComponent } from '@shared/components/community-post/community-post.component';

enum PostFiltering {
  All = 'Community.Posts.Filtering.All',
  Post = 'Community.Posts.Filtering.Post',
  Question = 'Community.Posts.Filtering.Question',
  Discussion = 'Community.Posts.Filtering.Discussion'
}

enum PostSorting {
  Top = 'Community.Posts.Sorting.Top',
  Relevant = 'Community.Posts.Sorting.Relevant',
  Latest = 'Community.Posts.Sorting.Latest'
}

@Component({
  selector: 'app-following',
  templateUrl: './following.component.html',
  styleUrls: ['./following.component.less']
})
export class FollowingComponent extends AppComponentBase implements OnInit, OnDestroy {
  @ViewChildren(CommunityPostCardComponent) postsContainer: CommunityPostCardComponent[];

  postsStateService: PostsStateService;
  postsDiscussionsStateServiceMap: PostsStateService[] = [];

  tempPosts: PostDto[] = Array(10).fill([]).map(() => this.generateRandomPost()) as PostDto[];
  posts: PostDto[] = [];
  totalPostsCount: number;

  usersYouMayKnow: UserDto[] = Array(5).fill([]).map(() => this.generateRandomUser()) as UserDto[];
  recommendedCourses: CourseDto[] = Array(4).fill([]).map(() => this.generateRandomCourse()) as CourseDto[];

  isLoading_usersYouMayKnow$ = new BehaviorSubject(true);
  isLoading_recommendedCourses$ = new BehaviorSubject(true);
  isLoadingPosts$ = new BehaviorSubject(true);

  usersYouMayKnowMaxItems: number = 0;
  recommendedCoursesMaxItems: number = 0;

  postFilteringEnum = PostFiltering;
  postSortingEnum = PostSorting;

  selectedFiltering: PostFiltering = PostFiltering.All;
  selectedSorting: PostSorting = PostSorting.Latest;

  constructor(
    injector: Injector,
    private _router: Router,
    private _cdr: ChangeDetectorRef,
    private _hubService: HubService,
    private _usersService: UserServiceProxy,
    private _coursesService: CoursesServiceProxy,
    private _postsService: PostsServiceProxy,
    private _communityService: CommunityService,
    private _modalService: BsModalService
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
  get hiddenPostsCount(): number { return this.totalPostsCount - this.posts.length; }

  get loadingSources$() {
    return [
      this.isLoadingPosts$,
      this.isLoading_usersYouMayKnow$,
      this.isLoading_recommendedCourses$,
    ];
  }

  get isLoading$() {
    return combineLatest(this.loadingSources$)
      .pipe(
        switchMap(loaders =>
          combineLatest([ of(loaders.some(l => l)), ...(this.postsContainer?.map(p => p.commentsContainer.isLoading$) ?? [of(false)]) ])
        )
      )
      .pipe(
        switchMap(loaders => of(loaders.some(l => l)))
      );
  }

  get postSort(): PostSort {
    switch(this.selectedSorting) {
      case PostSorting.Top:
          return PostSort.Top;
      case PostSorting.Relevant:
        return PostSort.Relevant;
      default:
        return PostSort.Latest;
    }
  }

  async ngOnInit() {
    this.loadInfiniteData(this._usersService, 'getAll', ['', true, true, 'creationTime desc', 0, 6], 'usersYouMayKnow');
    this.loadInfiniteData(this._coursesService, 'getByDates', [this.appSession.userId, undefined, undefined, undefined, DateGrains.Aged30, 0, 4], 'recommendedCourses');
    await this.initPostsAppStates();
    this.handleFilteringTopic();
    this.isLoading$.pipe(takeUntil(this.destroyed$)).subscribe(isLoading => this._communityService.setIsLoading(isLoading));
  }

  async ngOnDestroy() {
    await this.postsStateService?.stop();
  }

  handleSharePost(post: PostDto): void {
    this._postsService.get(post.id, undefined, false, false)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(post => {
        const modalSettings = this.defaultModalSettings as ModalOptions<UpsertPostComponent>;
        modalSettings.class = 'modal-lg';
        modalSettings.initialState = {
          allowTabs: false,
          canRemoveAttachment: true,
          title: 'Community.SharePost',
          activeTab: 'quick-post',
          model: {
            sharedPost: post,
            sharedId: post.id,
            sharedType: SharedType.Post
          }
        };
        this._modalService.show(UpsertPostComponent, modalSettings).content;
      });
  }

   handleFilteringTopic(): void {
    this._communityService.getSelectedTopics().subscribe(async value => {
      this.posts = await this.postsStateService.getPostsByTopic(value);
    });
  }

  private async initPostsAppStates() {
    const appStateConfig: AppStateConfig = { [this.postsStateId]: { load: [undefined, undefined, undefined, this.postSort, undefined, 0, MAX_POSTS_TO_LOAD], update: true } };
    const appStateServices: AppStateServices = { [this.postsStateId]: { type: PostsStateService, args: [this.appSession, this._hubService, this._postsService] } };
    await this.pubSubService.start(this, appStateConfig, appStateServices);
    this.postsStateService = this.pubSubService.getStateService<PostsStateService>(this.postsStateId);

    this.postsStateService.loading$.pipe(takeUntil(this.destroyed$)).subscribe(isLoading => this.isLoadingPosts$.next(isLoading));

    this.postsStateService.posts$.pipe(takeUntil(this.destroyed$)).subscribe(event => {
      if (this.postTypeFilter !== undefined && event.data.type !== this.postTypeFilter) return;
      switch (event.type) {
        case StateUpdateType.Add:
          this.posts = [event.data].concat(this.posts);
          this.totalPostsCount++;
          break;
        case StateUpdateType.Update:
          this.posts = this.posts.map(p => p.id === event.data.id ? event.data : p);
          break;
        case StateUpdateType.Delete:
          this.posts = this.posts.filter(p => p.id != event.data.id);
          this.totalPostsCount--;
          break;
      }
      this._cdr.detectChanges();
    });

    this.posts = this.postsStateService.getAllPosts();
    this.totalPostsCount = this.postsStateService.totalPostsCount;

    this._postsService.getAllCurrentUserDiscussions()
      .pipe(takeUntil(this.destroyed$))
      .subscribe(async (postIds): Promise<void> => {
        for (const postId of postIds) {
          await this.initDiscussionAppState(postId);
        }
      });
  }

  private async initDiscussionAppState(discussionId: string): Promise<void> {
    const appStateConfig: AppStateConfig = {
      [`posts-${discussionId}`]: {
        update: { postId: discussionId }
      }
    };
    const appStateServices: AppStateServices = {
      [`posts-${discussionId}`]: {
        type: PostsStateService,
        args: [this.appSession, this._hubService, this._postsService]
      }
    };

    await this.pubSubService.start(this, appStateConfig, appStateServices);
    this.postsDiscussionsStateServiceMap[discussionId] = this.pubSubService.getStateService<PostsStateService>(`posts-${discussionId}`);
    this.postsDiscussionsStateServiceMap[discussionId].posts$.pipe(takeUntil(this.destroyed$)).subscribe(event => {
      if (this.postTypeFilter !== undefined && event.data.type !== this.postTypeFilter) {
        return;
      }
      switch (event.type) {
        case StateUpdateType.Add:
          this.postsStateService.handleNewDiscussionPosts(event.data);
          break;
        case StateUpdateType.Delete:
          this.postsStateService.handleDeletePosts(event.data.id);
          break;
      }
      this._cdr.detectChanges();
    });
  }

  handleRecommendedCoursesRequestData(skipCount: number): void {
    const lastItem = this.recommendedCourses.slice(-1)[0];
    this.loadInfiniteData(this._coursesService, 'getByDates', [this.appSession.userId, undefined, lastItem.creationTime, undefined, DateGrains.Aged30, skipCount, 4], 'recommendedCourses');
  }

  handleCourseServiceCardClick(course: CourseDto): void {
    this._router.navigate(['app/course' , course.id, 'about']);
  }

  isSelectedFiltering(filter: PostFiltering): boolean {
    return this.selectedFiltering === filter;
  }

  isSelectedSorting(sort: PostSorting): boolean {
    return this.selectedSorting === sort;
  }

  async handleFilteringChange(filter: PostFiltering) {
    this.selectedFiltering = filter;
    await this.postsStateService.updateServiceParams({
      type: this.postTypeFilter,
      parentId: undefined,
      creationTime: undefined,
      postSort: this.postSort,
      notificationId: undefined
    }, true);
    this.posts = this.postsStateService.getAllPosts();
    this.totalPostsCount = this.postsStateService.totalPostsCount;
  }

  async handleSortingChange(sort: PostSorting) {
    this.selectedSorting = sort;
    await this.postsStateService.updateServiceParams({
      type: this.postTypeFilter,
      parentId: undefined,
      creationTime: undefined,
      postSort: this.postSort,
      notificationId: undefined
    }, true);
    this.posts = this.postsStateService.getAllPosts();
    this.totalPostsCount = this.postsStateService.totalPostsCount;
  }

  handleChildrenUpdate(post: PostDto) {
    this.postsStateService.updateChildrenCount(post);
  }

  onLoadMore(): void {
    // we don't need to display loader when loading more items.
    // this.postsStateService.loading$.next(true);
    const lastPostCreationTime = this.posts?.[this.posts.length - 1]?.creationTime;
    this._postsService.getAllPostsPaged(undefined, undefined, lastPostCreationTime, this.postSort, undefined, 0, MAX_POSTS_TO_LOAD)
        .subscribe(posts => {
          this.postsStateService.pushMorePosts(posts.items);
          this.posts = this.postsStateService.getAllPosts();
          // this.postsStateService.loading$.next(false);
          this._cdr.detectChanges();
        });
  }
}
