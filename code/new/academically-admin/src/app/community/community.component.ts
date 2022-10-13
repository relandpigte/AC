import { Component, Injector, OnInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { CourseDto, CoursesServiceProxy, DateGrains, UserDto, UserServiceProxy } from '@shared/service-proxies/service-proxies';
import { takeUntil } from 'rxjs/operators';

import * as _ from 'lodash';

@Component({
  selector: 'app-community',
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.less'],
  animations: [appModuleAnimation()],
})
export class CommunityComponent extends AppComponentBase implements OnInit {

  selectedTopics: string[] = [];
  suggestedTopics: { topic: string, followers: number }[] = [];
  peopleToFollow: UserDto[] = [];
  recommendedCourses: CourseDto[] = [];

  get topics(): string[] { return ['Test', 'Sample 10122022', 'Astronomy', 'Biology', 'Fiction']; }

  constructor(
    injector: Injector,
    private _usersService: UserServiceProxy,
    private _coursesService: CoursesServiceProxy
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.getSuggestedTopics();
    this.getPeopleToFollow();
    this.getRecommendedCourses();
  }

  handleFilterTopics(topics: string[]): void {
    this.selectedTopics = topics;
  }

  getCourseThumbnail(course: CourseDto): string {
    return course.thumbnailImageUrl ?? 'assets/img/img-placeholder.png';
  }

  getCourseComposition(course: CourseDto): string {
    const modules = course?.modules ? `${course?.modules} modules` : null;
    const lessons = course?.lessons ? `${course?.lessons} lessons` : null;
    const values = [modules, lessons].filter(x => x);
    return values.join(', ');
  }

  getSuggestedTopics(): void {
    this.suggestedTopics = [
      { topic: "Trending", followers: 2420 },
      { topic: "JustinBeiber", followers: 3520 },
      { topic: "OkiDokiCollective", followers: 1220 },
      { topic: "Trending", followers: 4220 }
    ];
  }

  getPeopleToFollow(): void {
    this._usersService.getAll('', true, 'creationTime desc', 0, 4)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(pagedUsers => this.peopleToFollow = pagedUsers.items ?? [])
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
          });
        }
      });
  }

}
