import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { CalendarEventDto, CalendarEventsServiceProxy } from '@shared/service-proxies/service-proxies';
import { takeUntil, finalize } from 'rxjs/operators';
import * as moment from 'moment';

@Component({
  selector: 'app-upcoming-sessions',
  templateUrl: './upcoming-sessions.component.html',
  styleUrls: ['./upcoming-sessions.component.less']
})
export class UpcomingSessionsComponent extends AppComponentBase implements OnInit {
  models: CalendarEventDto[] = [];
  isLoading = false;

  constructor(
    injector: Injector,
    private _calendarEventsService: CalendarEventsServiceProxy,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.getUpcomingSessions();
  }

  getDateIsoString(startTime: moment.Moment): string {
    return startTime.toDate().toISOString();
  }

  private getUpcomingSessions(): void {
    this.isLoading = true;
    this._calendarEventsService.getUpcoming(this.convertDateToMoment(new Date()), this.appSession.userId)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isLoading = false;
        }),
      )
      .subscribe(response => {
        this.models = response;
      });
  }
}
