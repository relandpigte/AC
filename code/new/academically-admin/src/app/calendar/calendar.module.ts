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
import rrulePlugin from '@fullcalendar/rrule';

import { CalendarComponent } from './calendar.component';
import { CreateEditBlockOutComponent } from './_components/create-edit-block-out/create-edit-block-out.component';
import { CreateEditBookingComponent } from './_components/create-edit-booking/create-edit-booking.component';
import { RescheduleHistoryComponent } from './_components/reschedule-history/reschedule-history.component';
import { CreateEditSchedulesComponent } from './_components/create-edit-schedules/create-edit-schedules.component';
import { DefaultSchedulesComponent } from './_components/create-edit-schedules/default-schedules/default-schedules.component';

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
    CreateEditBlockOutComponent,
    CreateEditBookingComponent,
    RescheduleHistoryComponent,
    CreateEditSchedulesComponent,
    DefaultSchedulesComponent,
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
