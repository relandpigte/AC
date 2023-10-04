import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { Calendar, CalendarOptions, FullCalendarComponent } from '@fullcalendar/angular';
import { DateClickArg } from '@fullcalendar/interaction';
import { AppComponentBase } from '@shared/app-component-base';
import { ShimmerType } from '@shared/enums/shimmer/shimmer-type.enum';
import { DashboardPagesService } from '@shared/services/dashboard-pages.service';

@Component({
  selector: 'app-tutor-calendar',
  templateUrl: './tutor-calendar.component.html',
  styleUrls: ['./tutor-calendar.component.less']
})
export class TutorCalendarComponent extends AppComponentBase implements OnInit {
  @ViewChild('calendar') calendarComponent: FullCalendarComponent;

  calendar: Calendar;
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    height: 'auto',
    themeSystem: 'bootstrap',
    headerToolbar: false,
    dateClick: this.handleDateClick.bind(this)
  };

  shimmerType = ShimmerType;

  constructor(
    injector: Injector,
    private _dashboardPageService: DashboardPagesService
  ) {
    super(injector);
  }

  get dateNow(): string { return moment().format('dddd, DD MMMM YYYY'); }
  get dateTitle(): string { return moment().format('MMMM, YYYY'); }
  get isLoading$() { return this._dashboardPageService.isLoading$; }

  ngOnInit(): void {
  }

  handleNextMonth(): void {
    this.calendarComponent.getApi().next();
  }

  handlePrevMonth(): void {
    this.calendarComponent.getApi().prev();
  }

  handleGotoCurrentMonth(): void {
    this.calendarComponent.getApi().today();
  }

  private handleDateClick(arg: DateClickArg): void {
    console.log(arg);
  }

}
