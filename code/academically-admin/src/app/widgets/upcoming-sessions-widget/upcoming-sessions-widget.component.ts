import { Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { SessionDto, UserSessionsServiceProxy } from '@shared/service-proxies/service-proxies';
import * as moment from 'moment';

@Component({
  selector: 'upcoming-sessions-widget',
  templateUrl: './upcoming-sessions-widget.component.html',
  styleUrls: ['./upcoming-sessions-widget.component.less']
})
export class UpcomingSessionsWidgetComponent extends AppComponentBase implements OnInit {
  isStudent = false;
  sessions: SessionDto[] = [];

  constructor(
    injector: Injector,
    private _sessionsService: UserSessionsServiceProxy,
    private _router: Router,
  ) {
    super(injector);
    this.isStudent = this.appSession.user.roles.includes('Student');
  }

  ngOnInit(): void {
    this.getSessions();
  }

  onJoinSessionClick(session: SessionDto): void {
    const startTime = session.sessionDate.subtract('minutes', 5);
    const endTime = startTime.add('minutes', session.duration);
    if (moment().isBetween(startTime, endTime, 'minutes')) {
      this._router.navigate(['/app/session', session.id]);
    } else {
      this.message.error('The session is not yet ready. Please check if you are within shedule before trying to join.', 'Session Not Ready');
    }
  }

  private getSessions(): void {
    this._sessionsService.getUpcoming(this.isStudent)
      .subscribe(sessions => {
        this.sessions = sessions;
      });
  }
}
