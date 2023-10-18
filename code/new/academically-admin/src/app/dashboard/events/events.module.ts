import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventsRoutingModule } from './events-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';
import { CreateWorkshopComponent } from './_components/create-workshop/create-workshop.component';
import { CreateBroadcastComponent } from './_components/create-broadcast/create-broadcast.component';
import { ChooseTemplateComponent } from './_components/choose-template/choose-template.component';
import { CreatedComponent } from './_components/created/created.component';
import { RequestsComponent } from './_components/requests/requests.component';
import { PurchasedComponent } from './_components/purchased/purchased.component';
import { ProgramsModule } from './_components/programs/programs.module';
import { EventsComponent } from './events.component';
import { LearningComponent } from './learning/learning.component';
import { TeachingComponent } from './teaching/teaching.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { DashboardModule } from '@app/dashboard/dashboard.module';
import { ForYouComponent } from '@app/dashboard/events/_components/for-you/for-you.component';

@NgModule({
  declarations: [
    EventsComponent,
    CreateWorkshopComponent,
    CreateBroadcastComponent,
    ChooseTemplateComponent,
    CreatedComponent,
    RequestsComponent,
    LearningComponent,
    TeachingComponent,
    ScheduleComponent,
    PurchasedComponent,
    ForYouComponent
  ],
  imports: [
    CommonModule,
    EventsRoutingModule,
    SharedModule,
    AppSharedModule,
    ProgramsModule,
    DashboardModule
  ],
})
export class EventsModule { }
