import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EducationRoutingModule } from './education-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';

import { EducationComponent } from './education.component';
import { EducationsComponent } from './_components/educations/educations.component';
import { CreateEditEducationComponent } from './_components/educations/create-edit-education/create-edit-education.component';
import { EducationLevelsComponent } from './_components/educations/education-levels/education-levels.component';
import { CreateEditEducationLevelComponent } from './_components/educations/education-levels/create-edit-education-level/create-edit-education-level.component';
import { ViewEducationDocumentsComponent } from './_components/educations/view-education-documents/view-education-documents.component';
import { QualificationsComponent } from './_components/qualifications/qualifications.component';
import { CreateEditQualificationComponent } from './_components/qualifications/create-edit-qualification/create-edit-qualification.component';
import { ViewQualificationDocumentsComponent } from './_components/qualifications/view-qualification-documents/view-qualification-documents.component';

@NgModule({
  declarations: [
    EducationComponent,
    EducationsComponent,
    CreateEditEducationComponent,
    EducationLevelsComponent,
    CreateEditEducationLevelComponent,
    ViewEducationDocumentsComponent,
    QualificationsComponent,
    CreateEditQualificationComponent,
    ViewQualificationDocumentsComponent,
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
