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
  dateFormat = 'DD-MM-YYYY H:mm:ss';

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
    const sStartTime = session.sessionDate.clone().utc(true).tz(session.timeZone).format(this.dateFormat);
    const startTime = moment(sStartTime, this.dateFormat).subtract('minutes', 5);
    const sEndTime = startTime.clone().add('minutes', session.duration).format(this.dateFormat);
    const endTime = moment(sEndTime, this.dateFormat);
    console.log(startTime);
    console.log(endTime);
    console.log(moment());
    if (moment().isBetween(startTime, endTime, undefined, '[]')) {
      this._router.navigate(['/app/session', session.id]);
    } else {
      this.message.error('The session is not yet ready. Please check if you are within shedule before trying to join.', 'Session Not Ready');
    }
  }

  private getSessionDateDisplay(session: SessionDto): { colorClass: string, date: string } {
    const sSessionDate = session.sessionDate.clone().utc(true).tz(session.timeZone).format(this.dateFormat);
    const sessionDate = moment(sSessionDate, this.dateFormat);
    const dateNow = new Date();
    if (sessionDate.isSame(dateNow, 'day')) {
      var duration = moment.duration(sessionDate.diff(moment(dateNow)));
      const hours = duration.hours();
      const minutes = duration.minutes();
      const seconds = duration.seconds();
      if (hours >= 0 && minutes >= 0 && seconds >= 0) {
        return {
          colorClass: 'text-red',
          date: `${this.formatDoubleDigitNumber(hours)}:${this.formatDoubleDigitNumber(minutes)}:${this.formatDoubleDigitNumber(seconds)}`
        };
      } else {
        return { colorClass: 'text-green', date: 'Ongoging' }
      }
    } else {
      return { colorClass: 'text-muted', date: sessionDate.format('DD/MM/YYYY HH:mm:ss') };
    }
  }

  private getSessions(): void {
    this._sessionsService.getUpcoming(this.isStudent)
      .subscribe(sessions => {
        this.sessions = sessions;
        this.sessions.forEach(session => {
          const sessionDateDisplay = this.getSessionDateDisplay(session);
          session['sessionDateDisplay'] = sessionDateDisplay.date;
          session['colorClass'] = sessionDateDisplay.colorClass;
        })
      });
  }

  private formatDoubleDigitNumber(num: number): string {
    return ("0" + num).slice(-2);
  }
}
