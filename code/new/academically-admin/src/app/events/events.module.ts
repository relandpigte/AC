import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventsRoutingModule } from './events-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';

import { EventsComponent } from './events.component';
import { LearningComponent } from './_components/learning/learning.component';
import { TeachingComponent } from './_components/teaching/teaching.component';
import { ChooseTemplateComponent } from './_components/choose-template/choose-template.component';
import { CreateEventComponent } from './_components/create-event/create-event.component';
import { EventListComponent } from './_components/teaching/event-list/event-list.component';
import { ScheduleListComponent } from './_components/teaching/schedule-list/schedule-list.component';

@NgModule({
  declarations: [
    EventsComponent,
    LearningComponent,
    TeachingComponent,
    ChooseTemplateComponent,
    CreateEventComponent,
    EventListComponent,
    ScheduleListComponent,
  ],
  imports: [
    CommonModule,
    EventsRoutingModule,
    SharedModule,
    AppSharedModule,
  ],
})
export class EventsModule { }
