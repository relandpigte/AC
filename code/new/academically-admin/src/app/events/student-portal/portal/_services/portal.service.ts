import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { EventDto, StudentEventDto } from '@shared/service-proxies/service-proxies';

@Injectable({
  providedIn: 'root'
})
export class PortalService {
  public event$: Observable<EventDto>;
  public audience$: Observable<StudentEventDto>;

  private _eventSubject: BehaviorSubject<EventDto>;
  private _audienceSubject: BehaviorSubject<StudentEventDto>;

  constructor() {
    this._eventSubject = new BehaviorSubject<EventDto>(undefined);
    this.event$ = this._eventSubject.asObservable();

    this._audienceSubject = new BehaviorSubject<StudentEventDto>(undefined);
    this.audience$ = this._audienceSubject.asObservable();
  }

  public set event(value: EventDto) {
    this._eventSubject.next(value);
  }

  public set audience(value: StudentEventDto) {
    this._audienceSubject.next(value);
  }
}
