import { Injectable } from '@angular/core';
import { BecomeATutorStep, TutorVerificationStepDto } from '@shared/service-proxies/service-proxies';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BecomeATutorService {
  public currentStep$: Observable<BecomeATutorStep>;
  public currentTutorWizardStep$: Observable<TutorVerificationStepDto>;

  private _currentStepSubject: BehaviorSubject<BecomeATutorStep>;
  private _currentTutorWizardStepSubject: BehaviorSubject<TutorVerificationStepDto>;

  constructor() {
    this._currentStepSubject = new BehaviorSubject<BecomeATutorStep>(null);
    this.currentStep$ = this._currentStepSubject.asObservable();

    this._currentTutorWizardStepSubject = new BehaviorSubject<TutorVerificationStepDto>(null);
    this.currentTutorWizardStep$ = this._currentTutorWizardStepSubject.asObservable();
  }

  public set currentStep(value: BecomeATutorStep) {
    this._currentStepSubject.next(value);
  }

  public set currentTutorWizardStep(value: TutorVerificationStepDto) {
    this._currentTutorWizardStepSubject.next(value);
  }
}
