import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { EventDto, StudentEventDto } from '@shared/service-proxies/service-proxies';

@Injectable({
  providedIn: 'root'
})
export class PortalService {
  public event$: Observable<EventDto>;
  public audiences$: Observable<StudentEventDto[]>;
  public audienceJoined$: Observable<StudentEventDto>;

  private _eventSubject: BehaviorSubject<EventDto>;
  private _audiencesSubject: BehaviorSubject<StudentEventDto[]>;
  private _audienceJoinedSubject: BehaviorSubject<StudentEventDto>;

  constructor() {
    this._eventSubject = new BehaviorSubject<EventDto>(undefined);
    this.event$ = this._eventSubject.asObservable();

    this._audienceJoinedSubject = new BehaviorSubject<StudentEventDto>(undefined);
    this.audienceJoined$ = this._audienceJoinedSubject.asObservable();

    this._audiencesSubject = new BehaviorSubject<StudentEventDto[]>([]);
    this.audiences$ = this._audiencesSubject.asObservable();
  }

  public set event(value: EventDto) {
    this._eventSubject.next(value);
  }

  public set audiences(value: StudentEventDto[]) {
    this._audiencesSubject.next(value);
  }

  public set audienceJoined(value: StudentEventDto) {
    this._audienceJoinedSubject.next(value);
  }
}
