import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoachingRoutingModule } from './coaching-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';
import { CreateCoachingComponent } from './_components/create-coaching/create-coaching.component';
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
    CreateCoachingComponent
  ],
  imports: [
    CommonModule,
    CoachingRoutingModule,
    SharedModule,
    AppSharedModule,
  ],
})
export class CoachingModule { }
