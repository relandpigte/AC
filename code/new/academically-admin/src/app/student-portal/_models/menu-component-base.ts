import { AppComponentBase } from '@shared/app-component-base';
import { Injector, Injectable } from '@angular/core';
import { CourseDto, CoursesServiceProxy } from '@shared/service-proxies/service-proxies';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';

@Injectable()
export class MenuComponentBase extends AppComponentBase {
  courseId: string;
  model: CourseDto = new CourseDto();

  private _route: ActivatedRoute;
  private _coursesService: CoursesServiceProxy;

  constructor(
    injector: Injector,
  ) {
    super(injector);
    this._route = injector.get(ActivatedRoute);
    this._coursesService = injector.get(CoursesServiceProxy);
    this._route.parent.parent.paramMap.subscribe(paramMap => {
      console.log(paramMap.has('course-id'));
      if (paramMap.has('course-id')) {
        this.courseId = paramMap.get('course-id');
      }
    });
  }

  getCourseImageUrl(courseImageUrl: string): string {
    if (courseImageUrl) {
      return courseImageUrl;
    }
    return 'assets/themes/dashkit/img/covers/profile-cover-1.jpg';
  }

  protected getCoure(): void {
    this._coursesService.get(this.courseId)
      .pipe(
        takeUntil(this.destroyed$),
      )
      .subscribe(response => {
        this.model = response;
      });
  }

}
