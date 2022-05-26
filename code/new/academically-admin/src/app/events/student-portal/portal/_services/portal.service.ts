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
  public speakRequest$: Observable<StudentEventDto>;
  public grantRequestToSpeak$: Observable<StudentEventDto>;
  public declineRequestToSpeak$: Observable<StudentEventDto>;
  public grantedRequestToSpeak$: Observable<boolean>;

  private _eventSubject: BehaviorSubject<EventDto>;
  private _audiencesSubject: BehaviorSubject<StudentEventDto[]>;
  private _presentersSubject: BehaviorSubject<EventPresenterDto[]>;
  private _audienceJoinedSubject: BehaviorSubject<StudentEventDto>;
  private _guestJoinedSubject: BehaviorSubject<EventPresenterDto>;
  private _admitGuestSubject: BehaviorSubject<EventPresenterDto>;
  private _speakRequestSubject: BehaviorSubject<StudentEventDto>;
  private _grantRequestToSpeakSubject: BehaviorSubject<StudentEventDto>;
  private _declineRequestToSpeakSubject: BehaviorSubject<StudentEventDto>;
  private _grantedRequestToSpeakSubject: BehaviorSubject<boolean>;

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

    this._speakRequestSubject = new BehaviorSubject<StudentEventDto>(undefined);
    this.speakRequest$ = this._speakRequestSubject.asObservable();

    this._grantRequestToSpeakSubject = new BehaviorSubject<StudentEventDto>(undefined);
    this.grantRequestToSpeak$ = this._grantRequestToSpeakSubject.asObservable();

    this._declineRequestToSpeakSubject = new BehaviorSubject<StudentEventDto>(undefined);
    this.declineRequestToSpeak$ = this._declineRequestToSpeakSubject.asObservable();

    this._grantedRequestToSpeakSubject = new BehaviorSubject<boolean>(undefined);
    this.grantedRequestToSpeak$ = this._grantedRequestToSpeakSubject.asObservable();
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

  public set speakRequest(value: StudentEventDto) {
    this._speakRequestSubject.next(value);
  }

  public set grantRequestToSpeak(value: StudentEventDto) {
    this._grantRequestToSpeakSubject.next(value);
  }

  public set declineRequestToSpeak(value: StudentEventDto) {
    this._declineRequestToSpeakSubject.next(value);
  }

  public set grantedRequestToSpeak(value: boolean) {
    this._grantedRequestToSpeakSubject.next(value);
  }
}
