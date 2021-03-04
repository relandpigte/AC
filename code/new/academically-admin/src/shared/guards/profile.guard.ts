import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateChild } from '@angular/router';
import { ProfilesServiceProxy, UserLoginInfoDto } from '@shared/service-proxies/service-proxies';
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
  ) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> | boolean {
    const userId = +route.paramMap.get('user-id');
    if (userId && userId !== this._appSession.user.id) {
      return this._profilesService.get(userId)
        .toPromise()
        .then(user => {
          if (user.isPublic) {
            const profile = new UserLoginInfoDto({
              id: user.id,
              name: user.name,
              surname: user.surname,
              userName: user.userName,
              emailAddress: user.emailAddress,
              profilePictureUrl: '',
              roles: user.roleNames,
            });
            this._profileService.user = profile;
            return true;
          } else {
            this._router.navigate(['/pages/403']);
            return false;
          }
        });
    } else {
      this._profileService.user = this._appSession.user;
      return true;
    }
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> | boolean {
    return this.canActivate(route, state);
  }
}
