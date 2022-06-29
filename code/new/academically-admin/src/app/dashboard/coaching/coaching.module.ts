import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoachingRoutingModule } from './coaching-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';
import { CreateCoachingComponent } from './_components/create-coaching/create-coaching.component';
import { ChooseTemplateComponent } from './_components/choose-template/choose-template.component';
import { ProgramsModule } from './_components/programs/programs.module';
import { RequestsComponent } from './_components/requests/requests.component';
import { LearningComponent } from './learning/learning.component';
import { TeachingComponent } from './teaching/teaching.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { CoachingComponent } from './coaching.component';

@NgModule({
  declarations: [
    CoachingComponent,
    LearningComponent,
    TeachingComponent,
    ScheduleComponent,
    CreateCoachingComponent,
    ChooseTemplateComponent,
    RequestsComponent
  ],
  imports: [
    CommonModule,
    CoachingRoutingModule,
    SharedModule,
    AppSharedModule,
    ProgramsModule
  ],
})
export class CoachingModule { }
