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

  onJoinSessionClick(model: CalendarEventDto): void {
    const w = 1024;
    const h = 768;

    const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : window.screenX;
    const dualScreenTop = window.screenTop !== undefined ? window.screenTop : window.screenY;

    const width = window.innerWidth
      ? window.innerWidth
      : document.documentElement.clientWidth
        ? document.documentElement.clientWidth
        : screen.width;
    const height = window.innerHeight
      ? window.innerHeight
      : document.documentElement.clientHeight
        ? document.documentElement.clientHeight
        : screen.height;

    const systemZoom = width / window.screen.availWidth;
    const left = (width - w) / 2 / systemZoom + dualScreenLeft;
    const top = (height - h) / 2 / systemZoom + dualScreenTop;
    window.open(
      `/app/sessions/${model.id}`,
      model.title,
      `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=${w / systemZoom},height=${h / systemZoom},left=${left},top=${top}`
    );
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
