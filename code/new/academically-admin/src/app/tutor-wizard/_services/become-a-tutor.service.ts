import { Injectable } from '@angular/core';
import { BecomeATutorStep, TutorVerificationStepDto } from '@shared/service-proxies/service-proxies';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BecomeATutorService {
  public currentStep$: Observable<BecomeATutorStep>;
  public currentTutorWizardStep$: Observable<TutorVerificationStepDto>;
  public userId$: Observable<number>;

  private _currentStepSubject: BehaviorSubject<BecomeATutorStep>;
  private _currentTutorWizardStepSubject: BehaviorSubject<TutorVerificationStepDto>;
  private _userIdSubject: BehaviorSubject<number>;

  constructor() {
    this._currentStepSubject = new BehaviorSubject<BecomeATutorStep>(null);
    this.currentStep$ = this._currentStepSubject.asObservable();

    this._currentTutorWizardStepSubject = new BehaviorSubject<TutorVerificationStepDto>(null);
    this.currentTutorWizardStep$ = this._currentTutorWizardStepSubject.asObservable();

    this._userIdSubject = new BehaviorSubject<number>(null);
    this.userId$ = this._userIdSubject.asObservable();
  }

  public set currentStep(value: BecomeATutorStep) {
    this._currentStepSubject.next(value);
  }

  public set currentTutorWizardStep(value: TutorVerificationStepDto) {
    this._currentTutorWizardStepSubject.next(value);
  }

  public set userId(value: number) {
    this._userIdSubject.next(value);
  }
}
