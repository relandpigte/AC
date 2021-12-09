import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { CourseService } from '@app/courses/_services/course.service';
import { CourseDto, CoursesServiceProxy } from '@shared/service-proxies/service-proxies';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CourseResolver implements Resolve<CourseDto> {
  constructor(
    private _courseService: CourseService,
    private _coursesService: CoursesServiceProxy,
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<CourseDto> {
    abp.ui.setBusy();
    let courseId = route.paramMap.get('course-id');
    courseId = courseId ? courseId : '00000000-0000-0000-0000-000000000000';
    return this._coursesService
      .get(courseId)
      .pipe(
        tap(course => {
          this._courseService.course = course;
        }),
        finalize(() => {
          abp.ui.clearBusy();
        })
      );
  }
}
