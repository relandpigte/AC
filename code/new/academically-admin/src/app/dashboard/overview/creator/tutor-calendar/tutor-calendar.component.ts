import {
  Component,
  OnInit,
  Injector,
  ViewChild,
  ChangeDetectorRef,
  AfterViewInit
} from '@angular/core';
import * as moment from 'moment';
import { Calendar, CalendarOptions, FullCalendarComponent } from '@fullcalendar/angular';
import { DateClickArg } from '@fullcalendar/interaction';
import { AppComponentBase } from '@shared/app-component-base';
import { ShimmerType } from '@shared/enums/shimmer/shimmer-type.enum';
import { DashboardPagesService } from '@shared/services/dashboard-pages.service';
import * as _ from 'lodash';
import { EventDto, EventsServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize, takeUntil } from '@node_modules/rxjs/operators';
import { ElementRef } from '@node_modules/@angular/core';

@Component({
  selector: 'app-tutor-calendar',
  templateUrl: './tutor-calendar.component.html',
  styleUrls: ['./tutor-calendar.component.less']
})
export class TutorCalendarComponent extends AppComponentBase implements OnInit, AfterViewInit {
  @ViewChild('calendar') calendarComponent: FullCalendarComponent;

  calendarOptions: CalendarOptions;

  events: EventDto[] = [];
  selectedEvents: EventDto[] = [];
  shimmerType = ShimmerType;
  private _dateClicked: string = moment().format('dddd, DD MMMM YYYY').toString();

  constructor(
    injector: Injector,
    private _dashboardPageService: DashboardPagesService,
    private _eventsService: EventsServiceProxy,
    private _elRef: ElementRef,
    private _cdr: ChangeDetectorRef
  ) {
    super(injector);
    this.initCreatedEvents();
  }

  get isLoading$() { return this._dashboardPageService.isLoading$; }
  get eventDates(): string[] { return this.events?.map(e => e.eventDateTime)?.map(d => moment(d).format('YYYY-MM-DD')); }

  get dateNow() { return this._dateClicked; }
  set dateNow(date) { this._dateClicked = date; }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this._cdr.detectChanges();
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

  private initCreatedEvents(): void {
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
        this.events = events.items;
        this.selectedEvents = events.items?.filter(e => moment(e.eventDateTime).isSame(moment(), 'day'));
        this.initCalendar();
      });
  }

  private initCalendar(): void {
    this.calendarOptions = {
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
  }
}
