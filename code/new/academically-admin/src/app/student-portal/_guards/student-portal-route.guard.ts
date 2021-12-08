import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { StudentCoursesServiceProxy } from '@shared/service-proxies/service-proxies';

@Injectable({
  providedIn: 'root'
})
export class StudentPortalRouteGuard implements CanActivate, CanActivateChild {
  constructor(
    private _studentCoursesService: StudentCoursesServiceProxy,
    private _router: Router,
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    abp.ui.setBusy();
    return new Promise((resolve) => {
      const courseId: string = route.params['course-id'];
      this._studentCoursesService.getByCourse(courseId)
        .subscribe(studentCourse => {
          if (state.url.includes('landing-page')) {
            abp.ui.clearBusy();
            if (studentCourse && studentCourse.id) {
              this._router.navigate([`/app/student-portal/${courseId}/home`]);
            } else {
              return resolve(true);
            }
          } else {
            abp.ui.clearBusy();
            if (!studentCourse || !studentCourse.id) {
              this._router.navigate([`/app/student-portal/${courseId}/landing-page`]);
            } else {
              return resolve(true);
            }
          }
        });
    });
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return this.canActivate(route, state);
  }

}
