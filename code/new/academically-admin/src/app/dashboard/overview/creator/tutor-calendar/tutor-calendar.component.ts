import { Component, OnInit, Injector, ViewChild, AfterViewInit } from '@angular/core';
import * as moment from 'moment';
import { Calendar, CalendarOptions, FullCalendarComponent } from '@fullcalendar/angular';
import { DateClickArg } from '@fullcalendar/interaction';
import { AppComponentBase } from '@shared/app-component-base';

@Component({
  selector: 'app-tutor-calendar',
  templateUrl: './tutor-calendar.component.html',
  styleUrls: ['./tutor-calendar.component.less']
})
export class TutorCalendarComponent extends AppComponentBase implements OnInit, AfterViewInit {
  @ViewChild('calendar', { static: true }) calendarComponent: FullCalendarComponent;

  calendar: Calendar;
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    height: 'auto',
    themeSystem: 'bootstrap',
    headerToolbar: false,
    dateClick: this.handleDateClick.bind(this)
  };

  constructor(
    injector: Injector
  ) {
    super(injector);
  }

  get dateNow(): string { return moment().format('dddd, DD MMMM YYYY'); }
  get dateTitle(): string { return moment().format('MMMM, YYYY'); }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.calendar = this.calendarComponent.getApi();
  }

  handleNextMonth(): void {
    this.calendar.next();
  }

  handlePrevMonth(): void {
    this.calendar.prev();
  }

  handleGotoCurrentMonth(): void {
    this.calendar.today();
  }

  private handleDateClick(arg: DateClickArg): void {
    console.log(arg);
  }

}
