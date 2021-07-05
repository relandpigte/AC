import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewTutorApplicationRoutingModule } from './view-tutor-application-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';

import { ViewTutorApplicationComponent } from './view-tutor-application.component';
import { TutorWizardStepComponent } from '@app/tutor-wizard/_components/tutor-wizard-step/tutor-wizard-step.component';
import { TutorWizardModule } from '@app/tutor-wizard/tutor-wizard.module';

@NgModule({
  declarations: [
    ViewTutorApplicationComponent,
  ],
  imports: [
    CommonModule,
    ViewTutorApplicationRoutingModule,
    SharedModule,
    AppSharedModule,
    TutorWizardModule
  ]
})
export class ViewTutorApplicationModule { }
