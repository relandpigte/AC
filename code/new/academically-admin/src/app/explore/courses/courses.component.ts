import { Component, Injector, OnInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { CourseDto, CourseDtoPagedResultDto, CoursesServiceProxy, DateGrains } from '@shared/service-proxies/service-proxies';
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
  latest: CourseDtoPagedResultDto;
  latestStartDate: moment.Moment;
  lastMonth: CourseDtoPagedResultDto;
  popular: CourseDtoPagedResultDto;

  isLoading = true;
  isPopularLoading = true;
  data: { [key: string]: CourseDto[] };

  showLastestShowMore: boolean = true;
  showLastMonthShowMoreButton: boolean = true;
  showPopularShowMoreButton: boolean = true;
  itemsPerGroup = 6;
  popularItems = 3;

  constructor(
    injector: Injector,
    private _coursesService: CoursesServiceProxy
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.loadData(0);
    this.loadPopular(0);
    setTimeout(() => this.isLoading = false, 5000);

  }

  setLatestShowMoreButtons(items: number): void {
    if (items == this.itemsPerGroup) {
      this.showLastestShowMore = true;
    } else {
      this.showLastestShowMore = false;
    }
  }

  setLastMonthShowMoreButtons(items: number): void {
    if (items == this.itemsPerGroup) {
      this.showLastMonthShowMoreButton = true;
    } else {
      this.showLastMonthShowMoreButton = false;
    }
  }

  setPopularShowMoreButtons(items: number): void {
    if (items == this.popularItems) {
      this.showPopularShowMoreButton = true;
    } else {
      this.showPopularShowMoreButton = false;
    }
  }

  private loadData(currentCount: number, start?: moment.Moment, moving?: moment.Moment, end?: moment.Moment): void {
    this.isLoading = true;
    this._coursesService.getByDates(this.appSession.userId, start,moving, end, DateGrains.Monthly, currentCount, this.itemsPerGroup)
      .pipe(takeUntil(this.destroyed$))
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(groupedCourses => {
        Object.keys(groupedCourses).forEach(range => {
          const [startDate] = range.split(' - ');
          console.log('GroupedCourses ----> ', groupedCourses[range]);
          if (moment().diff(moment(startDate), 'months')) {
            if (currentCount == 0) {
              this.latestStartDate = moment(startDate);
              this.lastMonth = groupedCourses[range];
              this.setLastMonthShowMoreButtons(this.lastMonth?.items?.length);
            }
            else {
              this.lastMonth.items.push(...groupedCourses[range].items);
              this.setLastMonthShowMoreButtons(groupedCourses[range]?.items?.length);
            }
          }
          else {
            this.latestStartDate = moment(startDate);
            if (currentCount == 0) {
              this.latest = groupedCourses[range];
              this.setLatestShowMoreButtons(this.latest?.items?.length);

            } else {
              this.setLatestShowMoreButtons(groupedCourses[range]?.items?.length);
              groupedCourses[range].items.forEach(item => {
                this.latest.items.push(item);
              });
            }
          }
        });
      });
  }

  private loadPopular(currentCount: number): void {
    this.isPopularLoading = true;
    this._coursesService.getByPopularity(this.appSession.userId, currentCount, this.popularItems)
      .pipe(takeUntil(this.destroyed$))
      .pipe(finalize(() => this.isPopularLoading = false))
      .subscribe(groupedCourses => {
        if (groupedCourses) {
          Object.keys(groupedCourses).forEach(label => {
            const [startDate] = label.split(' - ');
            console.log('Popular Courses ----> ', groupedCourses[label]);
            if (label == 'Popular') {
              if (currentCount == 0) {
                this.popular = groupedCourses[label];
                this.setPopularShowMoreButtons(this.popular?.items?.length);
              }
              else {
                this.popular.items.push(...groupedCourses[label].items);
                this.setPopularShowMoreButtons(groupedCourses[label]?.items?.length);
              }
            }
          });
        } else {
          console.log('NO RESULT');
          this.setPopularShowMoreButtons(1);
        }
      });
  }
}
