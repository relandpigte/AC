import { NgModule, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CoursesRoutingModule } from './courses-routing.module';
import { CourseTemplateComponent } from './course-template/course-template.component';
import { CourseWizardComponent } from './course-wizard/course-wizard.component';
import { SharedModule } from '@shared/shared.module';


@NgModule({
  declarations: [CourseTemplateComponent, CourseWizardComponent],
  imports: [
    CommonModule,
    CoursesRoutingModule,
    FormsModule,
    SharedModule
  ],
  exports: [CourseTemplateComponent, CourseWizardComponent]
})
export class CoursesModule { }
