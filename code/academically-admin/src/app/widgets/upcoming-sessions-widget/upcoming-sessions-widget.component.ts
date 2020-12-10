import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { SessionDto, UserSessionsServiceProxy } from '@shared/service-proxies/service-proxies';

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
    private _sessionsService: UserSessionsServiceProxy
  ) {
    super(injector);
    this.isStudent = this.appSession.user.roles.includes('Student');
  }

  ngOnInit(): void {
    this.getSessions();
  }

  private getSessions(): void {
    this._sessionsService.getUpcoming(this.isStudent)
      .subscribe(sessions => {
        this.sessions = sessions;
      });
  }
}
