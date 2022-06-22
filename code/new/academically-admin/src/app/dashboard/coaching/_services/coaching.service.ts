import { Injectable } from '@angular/core';
import { CoachingDto } from '@shared/service-proxies/service-proxies';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CoachingService {
  public coachingCreated$: Observable<CoachingDto>;

  private _coachingCreatedSubject: BehaviorSubject<CoachingDto>;

  constructor() {
    this._coachingCreatedSubject = new BehaviorSubject<CoachingDto>(undefined);
    this.coachingCreated$ = this._coachingCreatedSubject.asObservable();
  }

  public set coachingCreated(value: CoachingDto) {
    this._coachingCreatedSubject.next(value);
  }
}
