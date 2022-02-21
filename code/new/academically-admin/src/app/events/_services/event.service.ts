import { Injectable } from '@angular/core';
import { EventDto } from '@shared/service-proxies/service-proxies';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  public eventCreated$: Observable<EventDto>;

  private _eventCreatedSubject: BehaviorSubject<EventDto>;

  constructor() {
    this._eventCreatedSubject = new BehaviorSubject<EventDto>(undefined);
    this.eventCreated$ = this._eventCreatedSubject.asObservable();
  }

  public set eventCreated(value: EventDto) {
    this._eventCreatedSubject.next(value);
  }
}
