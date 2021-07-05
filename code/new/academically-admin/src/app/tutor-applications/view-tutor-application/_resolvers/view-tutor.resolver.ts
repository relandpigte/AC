import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { BecomeATutorService } from '@app/tutor-wizard/_services/become-a-tutor.service';
import { TutorApplicationServiceProxy, TutorVerificationStepDto, TutorWizardServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/session/app-session.service';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ViewTutorResolver implements Resolve<TutorVerificationStepDto> {
  constructor(
    private _appSession: AppSessionService,
    private _becomeATutorService: BecomeATutorService,
    private _tutorApplicationServiceProxy: TutorApplicationServiceProxy,
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<TutorVerificationStepDto> {
    abp.ui.setBusy();
    let userId = +route.paramMap.get('user-id');
    userId = userId ? userId : this._appSession.user.id;
    this._becomeATutorService.userId = userId;
    return this._tutorApplicationServiceProxy.getPendingStep(userId)
      .pipe(
        tap(response => {
          this._becomeATutorService.currentStep = response.step;
          this._becomeATutorService.currentTutorWizardStep = response;
        }),
        finalize(() => {
          abp.ui.clearBusy();
        })
      );
  }
}
