import { Injectable } from '@angular/core';
import { EventDto } from '@shared/service-proxies/service-proxies';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TutorPortalService {
  public event$: Observable<EventDto>;

  private _eventSubject: BehaviorSubject<EventDto>;

  constructor() {
    this._eventSubject = new BehaviorSubject<EventDto>(new EventDto());
    this.event$ = this._eventSubject.asObservable();
  }

  public set event(value: EventDto) {
    this._eventSubject.next(value);
  }
}
