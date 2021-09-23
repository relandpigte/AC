import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurriculumRoutingModule } from './curriculum-routing.module';

import { CurriculumComponent } from './curriculum.component';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';
import { LessonWizardComponent } from './_components/lesson-wizard/lesson-wizard.component';

@NgModule({
  declarations: [
    CurriculumComponent,
    LessonWizardComponent,
  ],
  imports: [
    CommonModule,
    CurriculumRoutingModule,
    SharedModule,
    AppSharedModule,
  ],
})
export class CurriculumModule { }
