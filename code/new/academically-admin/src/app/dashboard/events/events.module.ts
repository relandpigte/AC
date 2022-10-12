import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventsRoutingModule } from './events-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';
import { CreateWorkshopComponent } from './_components/create-workshop/create-workshop.component';
import { CreateBroadcastComponent } from './_components/create-broadcast/create-broadcast.component';
import { ChooseTemplateComponent } from './_components/choose-template/choose-template.component';
import { RequestsComponent } from './_components/requests/requests.component';
import { ProgramsModule } from './_components/programs/programs.module';
import { EventsComponent } from './events.component';
import { LearningComponent } from './learning/learning.component';
import { TeachingComponent } from './teaching/teaching.component';
import { ScheduleComponent } from './schedule/schedule.component';

@NgModule({
  declarations: [
    EventsComponent,
    CreateWorkshopComponent,
    CreateBroadcastComponent,
    ChooseTemplateComponent,
    RequestsComponent,
    LearningComponent,
    TeachingComponent,
    ScheduleComponent,
  ],
  imports: [
    CommonModule,
    EventsRoutingModule,
    SharedModule,
    AppSharedModule,
    ProgramsModule
  ],
})
export class EventsModule { }
