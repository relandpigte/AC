import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { CourseDto, CoursesServiceProxy, DateGrains, PostsServiceProxy, PostType, UserDto, UserServiceProxy } from '@shared/service-proxies/service-proxies';
import { CommunityPostService } from '@shared/services/community-post.service';
import { finalize, takeUntil } from 'rxjs/operators';
import { notificationNames } from '@shared/constants/notification-names.constant';

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
export class FollowingComponent extends AppComponentBase implements OnInit {

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

  constructor(
    injector: Injector,
    private _postSub: CommunityPostService,
    private _usersService: UserServiceProxy,
    private _coursesService: CoursesServiceProxy,
    private _postsService: PostsServiceProxy
  ) {
    super(injector);

    abp.event.on('abp.notifications.received', (notification) => {
      if(notification.notification.notificationName === notificationNames.postCreated 
      || notification.notification.notificationName === notificationNames.postUpdated){

         console.log(notification );
         // var postId = notification.notification.data.properties.PostId;
         // var post = this._postsService.get(postId);

         // Refresh list with single post
      }
    });
  }

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

  ngOnInit(): void {
    this.loadInfiniteData(this._usersService, 'getAll', ['', true, 'creationTime desc', 0, 6], 'usersYouMayKnow');
    this.loadInfiniteData(this._coursesService, 'getByDates', [this.appSession.userId, undefined, undefined, undefined, DateGrains.Aged30, 0, 4], 'recommendedCourses');

    this._postSub.postSubject$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(_ => this.getPosts());

    this.getPosts();

    this._postsService.subscribePostChanges()
      .subscribe();
  }

  private getPosts(): void {
    this.isLoadingPosts = true;
    this._postsService.getAllPosts(this.postTypeFilter, undefined)
      .pipe(takeUntil(this.destroyed$))
      .pipe(finalize(() => this.isLoadingPosts = false))
      .subscribe(posts => this.posts = posts);
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
    this.getPosts();
  }

  handleSortingChange(sort: PostSorting): void {
    this.selectedSorting = sort;
  }

}
