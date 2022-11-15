import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { CourseDto, CoursesServiceProxy, DateGrains, PostsServiceProxy, PostType, UserDto, UserServiceProxy } from '@shared/service-proxies/service-proxies';
import { CommunityPostService } from '@shared/services/community-post.service';
import { finalize, takeUntil } from 'rxjs/operators';

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

  constructor(
    injector: Injector,
    private _postSub: CommunityPostService,
    private _usersService: UserServiceProxy,
    private _coursesService: CoursesServiceProxy,
    private _postsService: PostsServiceProxy
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.loadInfiniteData(this._usersService, 'getAll', ['', true, 'creationTime desc', 0, 6], 'usersYouMayKnow');
    this.loadInfiniteData(this._coursesService, 'getByDates', [this.appSession.userId, undefined, undefined, undefined, DateGrains.Aged30, 0, 4], 'recommendedCourses');

    this._postSub.postSubject$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(_ => this.getPosts());

    this.getPosts();
  }

  private getPosts(): void {
    this.isLoadingPosts = true;
    this._postsService.getAllPosts(PostType.Discussion)
      .pipe(takeUntil(this.destroyed$))
      .pipe(finalize(() => this.isLoadingPosts = false))
      .subscribe(posts => this.posts = posts);
  }

}
