import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkshopRoutingModule } from './workshop-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';
import { CreateWorkshopComponent } from './_components/create-workshop/create-workshop.component';
import { ChooseTemplateComponent } from './_components/choose-template/choose-template.component';
import { WorkshopComponent } from './workshop.component';
import { LearningComponent } from './learning/learning.component';
import { TeachingComponent } from './teaching/teaching.component';
import { ScheduleComponent } from './schedule/schedule.component';

@NgModule({
  declarations: [
    WorkshopComponent,
    LearningComponent,
    TeachingComponent,
    ScheduleComponent,
    CreateWorkshopComponent,
    ChooseTemplateComponent
  ],
  imports: [
    CommonModule,
    WorkshopRoutingModule,
    SharedModule,
    AppSharedModule,
  ],
})
export class WorkshopModule { }
