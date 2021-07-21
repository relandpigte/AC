import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EducationRoutingModule } from './education-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';

import { EducationComponent } from './education.component';
import { EducationsComponent } from './_components/educations/educations.component';
import { CreateEditEducationComponent } from './_components/educations/create-edit-education/create-edit-education.component';
import { ViewEducationDocumentsComponent } from './_components/educations/view-education-documents/view-education-documents.component';
import { QualificationsComponent } from './_components/qualifications/qualifications.component';
import { CreateEditQualificationComponent } from './_components/qualifications/create-edit-qualification/create-edit-qualification.component';
import { ViewQualificationDocumentsComponent } from './_components/qualifications/view-qualification-documents/view-qualification-documents.component';
import { CoursesComponent } from './_components/educations/courses/courses.component';
import { CreateEditCourseComponent } from './_components/educations/courses/create-edit-course/create-edit-course.component';
import { SuggestQualificationComponent } from './_components/educations/courses/suggest-qualification/suggest-qualification.component';

@NgModule({
  declarations: [
    EducationComponent,
    EducationsComponent,
    CreateEditEducationComponent,
    ViewEducationDocumentsComponent,
    QualificationsComponent,
    CreateEditQualificationComponent,
    ViewQualificationDocumentsComponent,
    CoursesComponent,
    CreateEditCourseComponent,
    SuggestQualificationComponent,
  ],
  imports: [
    CommonModule,
    EducationRoutingModule,
    SharedModule,
    AppSharedModule,
  ],
  exports: [
    EducationsComponent,
  ]
})
export class EducationModule { }
