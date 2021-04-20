import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
  Router
} from '@angular/router';
import { ProfilesServiceProxy, UserDto } from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/session/app-session.service';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { ProfileService } from '../_services/profile.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileResolver implements Resolve<UserDto> {
  constructor(
    private _appSession: AppSessionService,
    private _router: Router,
    private _profileService: ProfileService,
    private _profilesService: ProfilesServiceProxy,
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<UserDto> {
    abp.ui.setBusy();
    let userId = +route.paramMap.get('user-id');
    userId = userId ? userId : this._appSession.user.id;
    return this._profilesService
      .get(userId)
      .pipe(
        tap(user => {
          if (userId && userId !== this._appSession.user.id) {
            if (!user.isPublic) {
              this._router.navigate(['/pages/403']);
            }
          } else {
            this._profileService.isViewOnly = false;
          }
          this._profileService.user = user;
        }),
        finalize(() => {
          abp.ui.clearBusy();
        })
      );
  }
}
