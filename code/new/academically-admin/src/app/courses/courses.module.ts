import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoursesRoutingModule } from './courses-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';

import { CoursesComponent } from './courses.component';
import { DetailsComponent } from './_components/details/details.component';
import { SettingsComponent } from './_components/settings/settings.component';
import { CurriculumComponent } from './_components/curriculum/curriculum.component';
import { LessonWizardComponent } from './_components/lesson-wizard/lesson-wizard.component';
import { TemplateComponent } from './_components/lesson-wizard/template/template.component';
import { NameComponent } from './_components/lesson-wizard/name/name.component';

@NgModule({
  declarations: [
    CoursesComponent,
    DetailsComponent,
    SettingsComponent,
    CurriculumComponent,
    LessonWizardComponent,
    TemplateComponent,
    NameComponent,
  ],
  imports: [
    CommonModule,
    CoursesRoutingModule,
    SharedModule,
    AppSharedModule,
  ],
})
export class CoursesModule { }
