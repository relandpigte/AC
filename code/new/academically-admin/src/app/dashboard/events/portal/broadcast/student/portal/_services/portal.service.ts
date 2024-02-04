import { Injectable } from '@angular/core';
import { HubConnection } from '@microsoft/signalr';
import {
  EventDto,
  EventUserDto,
  QuestionDto, ServiceFeatureFlagDto
} from '@shared/service-proxies/service-proxies';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PortalService {
  public event$: Observable<EventDto>;
  public attendees$: Observable<EventUserDto[]>;
  public attendeeJoined$: Observable<EventUserDto>;
  public attendeeLeft$: Observable<EventUserDto>;
  public guestJoined$: Observable<EventUserDto>;
  public lobbyUser$: Observable<EventUserDto>;
  public admitGuest$: Observable<EventUserDto>;
  public speakRequest$: Observable<EventUserDto>;
  public grantRequestToSpeak$: Observable<EventUserDto>;
  public declineRequestToSpeak$: Observable<EventUserDto>;
  public grantedRequestToSpeak$: Observable<boolean>;
  public hub$: Observable<HubConnection>;
  public liveQuestion$: Observable<QuestionDto>;
  public featureFlags$: Observable<ServiceFeatureFlagDto>;

  private _eventSubject: BehaviorSubject<EventDto>;
  private _attendeesSubject: BehaviorSubject<EventUserDto[]>;
  private _lobbyUserSubject: BehaviorSubject<EventUserDto>;
  private _attendeeJoinedSubject: BehaviorSubject<EventUserDto>;
  private _attendeeLeftSubject: BehaviorSubject<EventUserDto>;
  private _guestJoinedSubject: BehaviorSubject<EventUserDto>;
  private _admitGuestSubject: BehaviorSubject<EventUserDto>;
  private _speakRequestSubject: BehaviorSubject<EventUserDto>;
  private _grantRequestToSpeakSubject: BehaviorSubject<EventUserDto>;
  private _declineRequestToSpeakSubject: BehaviorSubject<EventUserDto>;
  private _grantedRequestToSpeakSubject: BehaviorSubject<boolean>;
  private _hubSubject: BehaviorSubject<HubConnection>;
  private _liveQuestion: BehaviorSubject<QuestionDto>;
  private _featureFlags: BehaviorSubject<ServiceFeatureFlagDto>;

  constructor() {
    this._eventSubject = new BehaviorSubject<EventDto>(undefined);
    this.event$ = this._eventSubject.asObservable();

    this._attendeeJoinedSubject = new BehaviorSubject<EventUserDto>(undefined);
    this.attendeeJoined$ = this._attendeeJoinedSubject.asObservable();

    this._attendeeLeftSubject = new BehaviorSubject<EventUserDto>(undefined);
    this.attendeeLeft$ = this._attendeeLeftSubject.asObservable();

    this._attendeesSubject = new BehaviorSubject<EventUserDto[]>([]);
    this.attendees$ = this._attendeesSubject.asObservable();

    this._guestJoinedSubject = new BehaviorSubject<EventUserDto>(undefined);
    this.guestJoined$ = this._guestJoinedSubject.asObservable();

    this._lobbyUserSubject = new BehaviorSubject<EventUserDto>(undefined);
    this.lobbyUser$ = this._lobbyUserSubject.asObservable();

    this._admitGuestSubject = new BehaviorSubject<EventUserDto>(undefined);
    this.admitGuest$ = this._admitGuestSubject.asObservable();

    this._speakRequestSubject = new BehaviorSubject<EventUserDto>(undefined);
    this.speakRequest$ = this._speakRequestSubject.asObservable();

    this._grantRequestToSpeakSubject = new BehaviorSubject<EventUserDto>(undefined);
    this.grantRequestToSpeak$ = this._grantRequestToSpeakSubject.asObservable();

    this._declineRequestToSpeakSubject = new BehaviorSubject<EventUserDto>(undefined);
    this.declineRequestToSpeak$ = this._declineRequestToSpeakSubject.asObservable();

    this._grantedRequestToSpeakSubject = new BehaviorSubject<boolean>(undefined);
    this.grantedRequestToSpeak$ = this._grantedRequestToSpeakSubject.asObservable();

    this._hubSubject = new BehaviorSubject<HubConnection>(undefined);
    this.hub$ = this._hubSubject.asObservable();

    this._liveQuestion = new BehaviorSubject<QuestionDto>(undefined);
    this.liveQuestion$ = this._liveQuestion.asObservable();

    this._featureFlags = new BehaviorSubject<ServiceFeatureFlagDto>(undefined);
    this.featureFlags$ = this._featureFlags.asObservable();
  }

  public set event(value: EventDto) {
    this._eventSubject.next(value);
  }

  public set attendees(value: EventUserDto[]) {
    this._attendeesSubject.next(value);
  }

  public set attendeeJoined(value: EventUserDto) {
    this._attendeeJoinedSubject.next(value);
  }

  public set attendeeLeft(value: EventUserDto) {
    this._attendeeLeftSubject.next(value);
  }

  public set guestJoined(value: EventUserDto) {
    this._guestJoinedSubject.next(value);
  }

  public set lobbyUser(value: EventUserDto) {
    this._lobbyUserSubject.next(value);
  }

  public set admitGuest(value: EventUserDto) {
    this._admitGuestSubject.next(value);
  }

  public set speakRequest(value: EventUserDto) {
    this._speakRequestSubject.next(value);
  }

  public set grantRequestToSpeak(value: EventUserDto) {
    this._grantRequestToSpeakSubject.next(value);
  }

  public set declineRequestToSpeak(value: EventUserDto) {
    this._declineRequestToSpeakSubject.next(value);
  }

  public set grantedRequestToSpeak(value: boolean) {
    this._grantedRequestToSpeakSubject.next(value);
  }

  public set hub(value: HubConnection) {
    this._hubSubject.next(value);
  }

  public set liveQuestion(value: QuestionDto) {
    this._liveQuestion.next(value);
  }

  public set featureFlags(value: ServiceFeatureFlagDto) {
    this._featureFlags.next(value);
  }
}
