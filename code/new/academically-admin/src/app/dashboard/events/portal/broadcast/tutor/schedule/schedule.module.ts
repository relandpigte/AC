import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScheduleRoutingModule } from './schedule-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';
import {ScheduleComponent} from './schedule.component';
import { UpcomingComponent } from './upcoming/upcoming.component';
import { PastComponent } from './past/past.component';

@NgModule({
  declarations: [ScheduleComponent, UpcomingComponent, PastComponent],
  imports: [
    CommonModule,
    SharedModule,
    AppSharedModule,
    ScheduleRoutingModule,
  ]
})
export class ScheduleModule { }
