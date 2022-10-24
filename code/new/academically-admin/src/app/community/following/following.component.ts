import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { CourseDto, CoursesServiceProxy, DateGrains, UserDto, UserServiceProxy } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-following',
  templateUrl: './following.component.html',
  styleUrls: ['./following.component.less']
})
export class FollowingComponent extends AppComponentBase implements OnInit {

  usersYouMayKnow: UserDto[] = Array(5).fill([]).map(() => this.generateRandomUser()) as UserDto[];
  recommendedCourses: CourseDto[] = Array(4).fill([]).map(() => this.generateRandomCourse()) as CourseDto[];

  isLoading_usersYouMayKnow = true;
  isLoading_recommendedCourses = true;

  usersYouMayKnowMaxItems: number = 0;
  recommendedCoursesMaxItems: number = 0;

  constructor(
    injector: Injector,
    private _usersService: UserServiceProxy,
    private _coursesService: CoursesServiceProxy
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.loadInfiniteData(this._usersService, 'getAll', ['', true, 'creationTime desc', 0, 6], 'usersYouMayKnow');
    this.loadInfiniteData(this._coursesService, 'getByDates', [this.appSession.userId, undefined, undefined, undefined, DateGrains.Aged30, 0, 4], 'recommendedCourses');
  }

}
