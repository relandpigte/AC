import { Component, Injector, Input, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { AppComponentBase } from '@shared/app-component-base';
import { CourseDto, CoursesServiceProxy, DateGrains } from '@shared/service-proxies/service-proxies';
import { BehaviorSubject, combineLatest, of } from 'rxjs';
import { finalize, switchMap, takeUntil } from 'rxjs/operators';
import { ShimmerType } from '@shared/enums/shimmer/shimmer-type.enum';
import { LandingPagesService } from '@shared/services/landing-pages.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-related-courses',
  templateUrl: './related-courses.component.html',
  styleUrls: ['./related-courses.component.less']
})
export class RelatedCoursesComponent extends AppComponentBase implements OnInit {
  @Input() data: CourseDto;

  relatedCourses: CourseDto[] = Array(4)
    .fill([])
    .map(() => this.generateRandomCourse()) as CourseDto[];
  isLoadingRelatedCourses$ = new BehaviorSubject<boolean>(true);

  constructor(
    injector: Injector,
    private _router: Router,
    private _coursesService: CoursesServiceProxy,
    private _landingPageService: LandingPagesService
  ) {
    super(injector);
  }

  get shimmerType() { return ShimmerType; }
  get isLoading$() { return combineLatest([this.isLoadingRelatedCourses$, this._landingPageService.isLoading$]).pipe(switchMap((loaders) => of(loaders.some(l => l)))); }

  ngOnInit(): void {
    this.getRelatedCourses();
  }

  getCourseComposition(course: CourseDto): string {
    const modules = course?.modules ? `${course?.modules} modules` : null;
    const lessons = course?.lessons ? `${course?.lessons} lessons` : null;
    const values = [modules, lessons].filter((x) => x);
    return values?.length ? values.join(' • ') : 'no lessons';
  }

  getCourseThumbnail(course: CourseDto): string {
    return course.thumbnailImageUrl ?? 'assets/img/img-placeholder.png';
  }

  getRelatedCourses(): void {
    this._coursesService
      .getByDates(
        this.appSession.userId,
        undefined,
        undefined,
        undefined,
        DateGrains.Aged30,
        undefined,
        0,
        4
      )
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isLoadingRelatedCourses$.next(false);
        })
      )
      .subscribe((pagedCourses) => {
        const courses = pagedCourses;
        if (courses) {
          this.relatedCourses = [];
          Object.keys(courses).forEach((range) => {
            this.relatedCourses = _.concat(
              this.relatedCourses,
              courses[range]?.items
            );
            this.relatedCourses = _.take(this.relatedCourses, 4);
          });
        }
      });
  }

  handleItemClick(item: any, type: string): void {
    switch (type) {
      case 'courses':
        this._router.navigate(['app/course', item.id, 'about']);
        break;
      default:
    }
  }
}
