import { ChangeDetectorRef, Component, Injector, OnDestroy, OnInit, ViewChildren } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';

import { HubService } from '@app/_shared/services/hub.service';
import { AppComponentBase } from '@shared/app-component-base';
import { CourseDto, CoursesServiceProxy, DateGrains, PostDto, PostsServiceProxy, PostType, UserDto, UserServiceProxy } from '@shared/service-proxies/service-proxies';
import { MAX_POSTS_TO_LOAD, PostsStateService } from '@shared/services/posts-state.service';
import { AppStateConfig, AppStateServices } from '@shared/services/pub-sub.service';
import { StateUpdateType } from '@shared/services/state-base.service';
import { CommunityDiscussionsComponent } from '@shared/components/community-discussions/community-discussions.component';
import { UpsertPostComponent } from '@shared/modals/upsert-post/upsert-post.component';
import { CommunityService } from '../community.service';
import { SharedType } from '@shared/service-proxies/service-proxies';
import { of } from 'rxjs';
import { WrapperService } from '@shared/services/wrapper.service';

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
  @ViewChildren(CommunityDiscussionsComponent) commentContainer: CommunityDiscussionsComponent;

  postsStateService: PostsStateService;

  posts: PostDto[] = Array(10).fill([]).map(() => this.generateRandomPost()) as PostDto[];
  totalPostsCount: number;

  usersYouMayKnow: UserDto[] = Array(5).fill([]).map(() => this.generateRandomUser()) as UserDto[];
  recommendedCourses: CourseDto[] = Array(4).fill([]).map(() => this.generateRandomCourse()) as CourseDto[];

  isLoading_usersYouMayKnow = true;
  isLoading_recommendedCourses = true;
  isLoadingPosts = true;

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
  get isLoading$() { return of(this.isLoadingPosts || this.commentContainer?.isLoadingComments || this.isLoading_usersYouMayKnow || this.isLoading_recommendedCourses); }

  async ngOnInit() {
    this.loadInfiniteData(this._usersService, 'getAll', ['', true, 'creationTime desc', 0, 6], 'usersYouMayKnow');
    this.loadInfiniteData(this._coursesService, 'getByDates', [this.appSession.userId, undefined, undefined, undefined, DateGrains.Aged30, 0, 4], 'recommendedCourses');
    await this.initPostsAppStates();
    this.handleFilteringTopic();
    this.isLoading$.pipe(takeUntil(this.destroyed$)).subscribe(isLoading => this._communityService.setIsLoading(isLoading));
  }

  ngOnDestroy() {
    this.pubSubService.stop();
  }

  handleSharePost(post: PostDto): void {
    this._postsService.get(post.id, false, false)
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
    const appStateConfig: AppStateConfig = { [this.postsStateId]: { load: [undefined, undefined, undefined, 0, MAX_POSTS_TO_LOAD], update: true } };
    const appStateServices: AppStateServices = { [this.postsStateId]: { type: PostsStateService, args: [this._hubService, this._postsService] } };
    await this.pubSubService.start(this, appStateConfig, appStateServices);
    this.postsStateService = this.pubSubService.getStateService<PostsStateService>(this.postsStateId);

    this.postsStateService.loading$.pipe(takeUntil(this.destroyed$)).subscribe(isLoading => this.isLoadingPosts = isLoading);

    this.postsStateService.posts$.pipe(takeUntil(this.destroyed$)).subscribe(event => {
      if (this.postTypeFilter !== undefined && event.data.type !== this.postTypeFilter) return;
      switch(event.type) {
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

  handleChildrenUpdate(post: PostDto) {
    this.postsStateService.updateChildrenCount(post);
  }

  onLoadMore(): void {
    // we don't need to display loader when loading more items.
    // this.postsStateService.loading$.next(true);
    const lastPostCreationTime = this.posts?.[this.posts.length - 1]?.creationTime;
    this._postsService.getAllPostsPaged(undefined, undefined, lastPostCreationTime, 0, MAX_POSTS_TO_LOAD)
        .subscribe(posts => {
          this.postsStateService.pushMorePosts(posts.items);
          this.posts = this.postsStateService.getAllPosts();
          // this.postsStateService.loading$.next(false);
          this._cdr.detectChanges();
        });
  }
}
