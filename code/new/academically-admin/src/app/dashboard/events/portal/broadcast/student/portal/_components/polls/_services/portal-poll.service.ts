import { Injectable } from '@angular/core';
import { EventPollDto } from '@shared/service-proxies/service-proxies';
import { BehaviorSubject, Observable } from 'rxjs';
import { PollTab } from '../polls.component';

@Injectable({
  providedIn: 'root'
})
export class PortalPollService {
  public pollTab$: Observable<PollTab>;
  public pollSelected$: Observable<EventPollDto>;
  public pollSelectedMaximized$: Observable<boolean>;
  public refreshPollQueue$: Observable<boolean>;

  private _pollTabSubject: BehaviorSubject<PollTab>;
  private _pollSelectedSubject: BehaviorSubject<EventPollDto>;
  private _pollSelectedMaximizedSubject: BehaviorSubject<boolean>;
  private _refreshPollQueueSubject: BehaviorSubject<boolean>;

  constructor() {
    this._pollTabSubject = new BehaviorSubject<PollTab>(PollTab.Queue);
    this.pollTab$ = this._pollTabSubject.asObservable();

    this._pollSelectedSubject = new BehaviorSubject<EventPollDto>(undefined);
    this.pollSelected$ = this._pollSelectedSubject.asObservable();

    this._pollSelectedMaximizedSubject = new BehaviorSubject<boolean>(false);
    this.pollSelectedMaximized$ = this._pollSelectedMaximizedSubject.asObservable();

    this._refreshPollQueueSubject = new BehaviorSubject<boolean>(undefined);
    this.refreshPollQueue$ = this._refreshPollQueueSubject.asObservable();
  }

  public set pollTabSelected(value: PollTab) { this._pollTabSubject.next(value); }
  public set pollSelected(value: EventPollDto) { this._pollSelectedSubject.next(value); }
  public set pollSelectedMaximized(value: boolean) { this._pollSelectedMaximizedSubject.next(value); }
  public set refreshPollQueue(value: boolean) { this._refreshPollQueueSubject.next(value); }
}
