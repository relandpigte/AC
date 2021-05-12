import { Injectable } from '@angular/core';
import { BecomeATutorStep } from '@shared/service-proxies/service-proxies';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BecomeATutorService {
  public currentStep$: Observable<BecomeATutorStep>;

  private _currentStepSubject: BehaviorSubject<BecomeATutorStep>;

  constructor() {
    this._currentStepSubject = new BehaviorSubject<BecomeATutorStep>(null);
    this.currentStep$ = this._currentStepSubject.asObservable();
  }

  public set currentStep(value: BecomeATutorStep) {
    this._currentStepSubject.next(value);
  }
}
