import { Component, ElementRef, Injector, OnInit, ViewChild } from '@angular/core';
import { CalendarOptions, FullCalendarComponent } from '@fullcalendar/angular';
import { DateClickArg } from '@fullcalendar/interaction';
import * as moment from 'moment';
import * as _ from 'lodash';
import { finalize, takeUntil } from 'rxjs/operators';

import { ShimmerType } from '@shared/enums/shimmer/shimmer-type.enum';
import { DashboardPagesService } from '@shared/services/dashboard-pages.service';
import { EventDto, EventsServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/app-component-base';

@Component({
  selector: 'app-student-calendar',
  templateUrl: './student-calendar.component.html',
  styleUrls: ['./student-calendar.component.less']
})
export class StudentCalendarComponent extends AppComponentBase implements OnInit {
  @ViewChild('calendar') calendarComponent: FullCalendarComponent;

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    height: 'auto',
    themeSystem: 'bootstrap',
    headerToolbar: {
      left:   'title',
      center: '',
      right:  'prev,next'
    },
    dateClick: this.handleDateClick.bind(this),
    dayCellClassNames: this.dayCellClassNamesCallback.bind(this),
    timeZone: 'UTC',
    showNonCurrentDates: false
  };

  shimmerType = ShimmerType;
  purchasedEvents: EventDto[] = [];
  selectedEvents: EventDto[] = [];

  private _dateClicked: string = moment().format('dddd, DD MMMM YYYY').toString();

  constructor(
    injector: Injector,
    private _dashboardPageService: DashboardPagesService,
    private _eventsService: EventsServiceProxy,
    private _elRef: ElementRef
  ) {
    super(injector);
    this.initPurchasedEvents();
  }

  get isLoading$() { return this._dashboardPageService.isLoading$; }
  get events(): EventDto[] { return this.purchasedEvents; }
  get eventDates(): string[] { return this.events?.map(e => e.eventDateTime)?.map(d => moment(d).format('YYYY-MM-DD')); }

  get dateNow() { return this._dateClicked; }
  set dateNow(date) { this._dateClicked = date; }

  ngOnInit(): void {
  }

  getEventSchedule(data: EventDto): string {
    if (moment(data.eventDateTime).diff(moment(), 'minutes') < 1 && moment(data.eventDateTime).isAfter()) {
      return this.l('LiveNow');
    } else if (moment(data.eventDateTime).diff(moment(), 'hours') < 1 && moment(data.eventDateTime).isAfter()) {
      return this.l('StartingIn', this.convertMomentToDateAgo(data.eventDateTime, true));
    }
    return this.l(
      'Starting',
      moment(data.eventDateTime).format('HH:mm'),
      moment(data.eventDateTime).add(data.duration, 'minutes')?.format('HH:mm'),
      moment(data.eventDateTime).format('DD MMM, YYYY')
    );
  }

  private handleDateClick(info: DateClickArg): void {
    this.selectedEvents = this.events?.filter(e => moment(e.eventDateTime).isSame(moment(info.date), 'day'));
    this.dateNow = moment(info.date).format('dddd, DD MMMM YYYY').toString();

    const dayGrid = this._elRef.nativeElement.querySelectorAll('.fc-daygrid-day');
    _.each(dayGrid, (day: HTMLDivElement): void => {
      day.classList.remove('active');
    });
    info.dayEl.classList.add('active');
  }

  private initPurchasedEvents(): void {
    this._dashboardPageService.setIsLoading(true);
    this._eventsService.getAll(
      undefined,
      this.appSession.userId,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined
    )
      .pipe(takeUntil(this.destroyed$))
      .pipe(finalize(() => this._dashboardPageService.setIsLoading(false)))
      .subscribe(events => {
        this.purchasedEvents = events.items;
        this.selectedEvents = events.items?.filter(e => moment(e.eventDateTime).isSame(moment(), 'day'));
      });
  }

  private dayCellClassNamesCallback(date: any): string {
    if (!this.eventDates.includes(moment(date.date).format('YYYY-MM-DD'))) {
      return;
    }

    const currentDate = moment(date.date).format('YYYY-MM-DD');
    if (moment(currentDate).isAfter()) {
      return 'future-events';
    }

    if (moment().isSame(moment(currentDate), 'day')) {
      return 'active';
    }
    return;
  }
}
