import { Component, Injector, OnInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { CourseDto, CoursesServiceProxy, DateGrains } from '@shared/service-proxies/service-proxies';
import { finalize, takeUntil } from 'rxjs/operators';

import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
  selector: 'app-explore-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.less'],
  animations: [appModuleAnimation()],
})
export class ExploreCoursesComponent extends AppComponentBase implements OnInit {

  featured: CourseDto[] = Array(5).fill([]).map(() => this.generateRandomCourse()) as CourseDto[];
  latest: CourseDto[] = Array(3).fill([]).map(() => this.generateRandomCourse()) as CourseDto[];
  lastMonth: CourseDto[] = Array(3).fill([]).map(() => this.generateRandomCourse()) as CourseDto[];

  isLoading = true;

  constructor(
    injector: Injector,
    private _coursesService: CoursesServiceProxy
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.isLoading = true;
    this._coursesService.getByDates(DateGrains.Monthly, 6)
      .pipe(takeUntil(this.destroyed$))
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(courses => {
        this.latest = [];
        this.lastMonth = [];
        Object.keys(courses).forEach(range => {
          const [startDate] = range.split(' - ');
          if (moment().diff(moment(startDate), 'months'))
            this.lastMonth = _.concat(this.lastMonth, courses[range]);
          else
            this.latest = _.concat(this.latest, courses[range]);
        });
      });
  }
}
