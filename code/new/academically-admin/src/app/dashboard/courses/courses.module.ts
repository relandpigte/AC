import { NgModule, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';

import { CoursesComponent } from './courses.component';
import { CourseTemplateComponent } from './course-template/course-template.component';
import { CourseWizardComponent } from './course-wizard/course-wizard.component';
import { CourseNameComponent } from './course-name/course-name.component';
import { TeachingComponent } from './teaching/teaching.component';
import { LearningComponent } from './learning/learning.component';

@NgModule({
  declarations: [
    CoursesComponent,
    CourseTemplateComponent,
    CourseWizardComponent,
    CourseNameComponent,
    TeachingComponent,
    LearningComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    AppSharedModule,
  ],
  exports: [
    CoursesComponent,
    CourseTemplateComponent,
    CourseWizardComponent,
    CourseNameComponent,
  ],
})
export class CoursesModule { }
