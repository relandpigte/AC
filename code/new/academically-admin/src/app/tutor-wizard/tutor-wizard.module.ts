import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TutorWizardRoutingModule } from './tutor-wizard-routing.module';
import { SharedModule } from '@shared/shared.module';

import { TutorWizardComponent } from './tutor-wizard.component';
import { TutorWizardStepComponent } from './_components/tutor-wizard-step/tutor-wizard-step.component';
import { TutorWizardStepDeclinedComponent } from './_components/tutor-wizard-step-declined/tutor-wizard-step-declined.component';
import { AppSharedModule } from '@app/_shared/app-shared.module';

@NgModule({
  declarations: [
    TutorWizardComponent,
    TutorWizardStepComponent,
    TutorWizardStepDeclinedComponent,
  ],
  imports: [
    CommonModule,
    TutorWizardRoutingModule,
    SharedModule,

    AppSharedModule,
  ],
  exports: [
    TutorWizardStepComponent
  ]
})
export class TutorWizardModule { }
