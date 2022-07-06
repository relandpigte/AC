import { Injectable } from '@angular/core';
import { EventPollDto } from '@shared/service-proxies/service-proxies';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PortalPollService {
  public pollSelected$: Observable<EventPollDto>;
  public pollCancelled$: Observable<EventPollDto>;
  public pollClosed$: Observable<EventPollDto>;
  public refreshPollQueue$: Observable<boolean>;

  private _pollSelectedSubject: BehaviorSubject<EventPollDto>;
  private _pollCancelledSubject: BehaviorSubject<EventPollDto>;
  private _pollClosedSubject: BehaviorSubject<EventPollDto>;
  private _refreshPollQueueSubject: BehaviorSubject<boolean>;

  constructor() {
    this._pollSelectedSubject = new BehaviorSubject<EventPollDto>(undefined);
    this.pollSelected$ = this._pollSelectedSubject.asObservable();

    this._pollCancelledSubject = new BehaviorSubject<EventPollDto>(undefined);
    this.pollCancelled$ = this._pollCancelledSubject.asObservable();

    this._pollClosedSubject = new BehaviorSubject<EventPollDto>(undefined);
    this.pollClosed$ = this._pollClosedSubject.asObservable();

    this._refreshPollQueueSubject = new BehaviorSubject<boolean>(undefined);
    this.refreshPollQueue$ = this._refreshPollQueueSubject.asObservable();
  }

  public set pollSelected(value: EventPollDto) { this._pollSelectedSubject.next(value); }
  public set pollCancelled(value: EventPollDto) { this._pollCancelledSubject.next(value); }
  public set pollClosed(value: EventPollDto) { this._pollClosedSubject.next(value); }
  public set refreshPollQueue(value: boolean) { this._refreshPollQueueSubject.next(value); }
}
