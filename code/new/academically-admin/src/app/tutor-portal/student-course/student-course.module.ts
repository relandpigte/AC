import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentCourseRoutingModule } from './student-course-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';

import { StudentCourseComponent } from './student-course.component';

@NgModule({
  declarations: [
    StudentCourseComponent,
  ],
  imports: [
    CommonModule,
    StudentCourseRoutingModule,
    SharedModule,
    AppSharedModule,
  ],
})
export class StudentCourseModule { }
