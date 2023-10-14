import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';
import { ServicesServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/session/app-session.service';

@Injectable({
  providedIn: 'root'
})
export class StudentPortalRouteGuard implements CanActivate, CanActivateChild {
  constructor(
    private _appSession: AppSessionService,
    private _servicesService: ServicesServiceProxy,
    private _router: Router,
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    abp.ui.setBusy();
    return new Promise((resolve) => {
      const courseId: string = route.params['course-id'];
      this._servicesService.getAllPurchases(courseId, this._appSession.userId)
        .subscribe(([purchase]) => {
          if (state.url.includes('landing-page')) {
            abp.ui.clearBusy();
            if (purchase?.id) {
              this._router.navigate([`/app/student-portal/${courseId}/home`]);
            } else {
              return resolve(true);
            }
          } else {
            abp.ui.clearBusy();
            if (!purchase?.id) {
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
