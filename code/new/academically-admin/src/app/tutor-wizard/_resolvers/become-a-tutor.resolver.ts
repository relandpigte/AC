import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { BecomeATutorStep, TutorWizardServiceProxy, UserDto } from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/session/app-session.service';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BecomeATutorResolver implements Resolve<BecomeATutorStep> {
  constructor(
    private _appSession: AppSessionService,
    private _tutorWizardServiceProxy: TutorWizardServiceProxy,
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<BecomeATutorStep> {
    abp.ui.setBusy();
    let userId = +route.paramMap.get('user-id');
    userId = userId ? userId : this._appSession.user.id;
    return this._tutorWizardServiceProxy.getCurrentStep()
      .pipe(
        finalize(() => {
          abp.ui.clearBusy();
        })
      );
  }
}
