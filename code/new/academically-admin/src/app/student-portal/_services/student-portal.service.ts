import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentPortalService {
  public sectionFinished$: Observable<string>;
  public percentage$: Observable<number>;

  private _sectionFinishedSubject: BehaviorSubject<string>;
  private _percentageSubject: BehaviorSubject<number>;

  constructor() {
    this._sectionFinishedSubject = new BehaviorSubject<string>(undefined);
    this.sectionFinished$ = this._sectionFinishedSubject.asObservable();
    this._percentageSubject = new BehaviorSubject<number>(0);
    this.percentage$ = this._percentageSubject.asObservable();
  }

  public set sectionFinished(value: string) {
    this._sectionFinishedSubject.next(value);
  }

  public set percentage(value: number) {
    this._percentageSubject.next(value);
  }
}
