import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { EventDto, EventPresenterDto, StudentEventDto } from '@shared/service-proxies/service-proxies';

@Injectable({
  providedIn: 'root'
})
export class PortalService {
  public event$: Observable<EventDto>;
  public audiences$: Observable<StudentEventDto[]>;
  public presenters$: Observable<EventPresenterDto[]>;
  public audienceJoined$: Observable<StudentEventDto>;
  public guestJoined$: Observable<EventPresenterDto>;
  public admitGuest$: Observable<EventPresenterDto>;

  private _eventSubject: BehaviorSubject<EventDto>;
  private _audiencesSubject: BehaviorSubject<StudentEventDto[]>;
  private _presentersSubject: BehaviorSubject<EventPresenterDto[]>;
  private _audienceJoinedSubject: BehaviorSubject<StudentEventDto>;
  private _guestJoinedSubject: BehaviorSubject<EventPresenterDto>;
  private _admitGuestSubject: BehaviorSubject<EventPresenterDto>;

  constructor() {
    this._eventSubject = new BehaviorSubject<EventDto>(undefined);
    this.event$ = this._eventSubject.asObservable();

    this._audienceJoinedSubject = new BehaviorSubject<StudentEventDto>(undefined);
    this.audienceJoined$ = this._audienceJoinedSubject.asObservable();

    this._audiencesSubject = new BehaviorSubject<StudentEventDto[]>([]);
    this.audiences$ = this._audiencesSubject.asObservable();

    this._presentersSubject = new BehaviorSubject<EventPresenterDto[]>([]);
    this.presenters$ = this._presentersSubject.asObservable();

    this._guestJoinedSubject = new BehaviorSubject<EventPresenterDto>(undefined);
    this.guestJoined$ = this._guestJoinedSubject.asObservable();

    this._admitGuestSubject = new BehaviorSubject<EventPresenterDto>(undefined);
    this.admitGuest$ = this._admitGuestSubject.asObservable();
  }

  public set event(value: EventDto) {
    this._eventSubject.next(value);
  }

  public set audiences(value: StudentEventDto[]) {
    this._audiencesSubject.next(value);
  }

  public set presenters(value: EventPresenterDto[]) {
    this._presentersSubject.next(value);
  }

  public set audienceJoined(value: StudentEventDto) {
    this._audienceJoinedSubject.next(value);
  }

  public set guestJoined(value: EventPresenterDto) {
    this._guestJoinedSubject.next(value);
  }

  public set admitGuest(value: EventPresenterDto) {
    this._admitGuestSubject.next(value);
  }
}
