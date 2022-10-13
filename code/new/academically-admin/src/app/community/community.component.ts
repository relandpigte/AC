import { Component, Injector, OnInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { CourseDto, CoursesServiceProxy, DateGrains } from '@shared/service-proxies/service-proxies';
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
  recommendedCourses: CourseDto[] = [];

  get topics(): string[] { return ['Test', 'Sample 10122022', 'Astronomy', 'Biology', 'Fiction']; }

  constructor(
    injector: Injector,
    private _coursesService: CoursesServiceProxy
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.getSuggestedTopics();
  }

  handleFilterTopics(topics: string[]): void {
    this.selectedTopics = topics;
  }

  getSuggestedTopics(): void {
    this.suggestedTopics = [
      { topic: "Trending", followers: 2420 },
      { topic: "JustinBeiber", followers: 3520 },
      { topic: "OkiDokiCollective", followers: 1220 },
      { topic: "Trending", followers: 4220 }
    ];
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

      })
  }

}
