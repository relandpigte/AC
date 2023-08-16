import { Component, OnInit, Injector, ViewChild, AfterViewInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { CalendarOptions, Calendar, FullCalendarComponent } from '@fullcalendar/angular';
import { DateClickArg } from '@fullcalendar/interaction';
import * as moment from 'moment';

@Component({
  selector: 'app-student-calendar',
  templateUrl: './student-calendar.component.html',
  styleUrls: ['./student-calendar.component.less']
})
export class StudentCalendarComponent extends AppComponentBase implements OnInit, AfterViewInit {
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
