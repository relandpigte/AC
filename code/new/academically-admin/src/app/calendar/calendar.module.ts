import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarRoutingModule } from './calendar-routing.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import bootstrapPlugin from '@fullcalendar/bootstrap';
import rrulePlugin from '@fullcalendar/rrule'

import { CalendarComponent } from './calendar.component';
import { BlockDateComponent } from './_components/block-date/block-date.component';

FullCalendarModule.registerPlugins([
  dayGridPlugin,
  timeGridPlugin,
  listPlugin,
  bootstrapPlugin,
  interactionPlugin,
  rrulePlugin,
]);

@NgModule({
  declarations: [
    CalendarComponent,
    BlockDateComponent,
  ],
  imports: [
    CommonModule,
    CalendarRoutingModule,
    AppSharedModule,
    FullCalendarModule,
  ],
  exports: [
    CalendarComponent,
  ]
})
export class CalendarModule { }
