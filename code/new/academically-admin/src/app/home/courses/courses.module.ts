import { NgModule, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CoursesRoutingModule } from './courses-routing.module';
import { CourseTemplateComponent } from './course-template/course-template.component';
import { CourseWizardComponent } from './course-wizard/course-wizard.component';
import { SharedModule } from '@shared/shared.module';
import { CourseNameComponent } from './course-name/course-name.component';

@NgModule({
  declarations: [
    CourseTemplateComponent,
    CourseWizardComponent,
    CourseNameComponent,
  ],
  imports: [
    CommonModule,
    CoursesRoutingModule,
    FormsModule,
    SharedModule,
  ],
  exports: [
    CourseTemplateComponent,
    CourseWizardComponent,
    CourseNameComponent,
  ],
})
export class CoursesModule { }
