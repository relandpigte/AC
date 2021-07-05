import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { BecomeATutorStep, TutorVerificationStepDto, TutorWizardServiceProxy, UserDto } from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/session/app-session.service';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { BecomeATutorService } from '../_services/become-a-tutor.service';

@Injectable({
  providedIn: 'root'
})
export class BecomeATutorResolver implements Resolve<TutorVerificationStepDto> {
  constructor(
    private _appSession: AppSessionService,
    private _becomeATutorService: BecomeATutorService,
    private _tutorWizardServiceProxy: TutorWizardServiceProxy,
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<TutorVerificationStepDto> {
    abp.ui.setBusy();
    let userId = +route.paramMap.get('user-id');
    userId = userId ? userId : this._appSession.user.id;
    return this._tutorWizardServiceProxy.getCurrentStep()
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
