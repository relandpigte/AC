import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventsRoutingModule } from './events-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';
import { TeachingModule } from './_components/teaching/teaching.module';
import { LearningModule } from './_components/learning/learning.module';
import { ScheduleModule } from './_components/schedule/schedule.module';
import { EventsComponent } from './events.component';
import { ChooseTemplateComponent } from './_components/choose-template/choose-template.component';
import { CreateEventComponent } from './_components/create-event/create-event.component';

@NgModule({
  declarations: [
    EventsComponent,
    ChooseTemplateComponent,
    CreateEventComponent,
  ],
  imports: [
    CommonModule,
    EventsRoutingModule,
    SharedModule,
    AppSharedModule,
    TeachingModule,
    LearningModule,
    ScheduleModule
  ],
})
export class EventsModule { }
