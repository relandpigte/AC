import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateChild } from '@angular/router';
import { ProfilesServiceProxy } from '@shared/service-proxies/service-proxies';
import { ProfileService } from '@shared/services/profile.service';
import { AppSessionService } from '@shared/session/app-session.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileGuard implements CanActivate, CanActivateChild {
  constructor(
    private _profilesService: ProfilesServiceProxy,
    private _appSession: AppSessionService,
    private _profileService: ProfileService,
    private _router: Router,
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> | boolean {
    let userId = +route.paramMap.get('user-id');
    userId = userId ? userId : this._appSession.user.id;
    return this._profilesService.get(userId)
      .toPromise()
      .then(user => {
        if (userId && userId !== this._appSession.user.id) {
          if (!user.isPublic) {
            this._router.navigate(['/pages/403']);
            return false;
          }
        } else {
          this._profileService.isViewOnly = false;
        }
        this._profileService.user = user;
        return true;
      });
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> | boolean {
    return this.canActivate(route, state);
  }
}
