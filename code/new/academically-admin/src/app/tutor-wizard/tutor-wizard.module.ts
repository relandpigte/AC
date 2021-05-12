import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TutorWizardRoutingModule } from './tutor-wizard-routing.module';
import { SharedModule } from '@shared/shared.module';

import { TutorWizardComponent } from './tutor-wizard.component';
import { TutorWizardStepComponent } from './_components/tutor-wizard-step/tutor-wizard-step.component';

@NgModule({
  declarations: [
    TutorWizardComponent,
    TutorWizardStepComponent,
  ],
  imports: [
    CommonModule,
    TutorWizardRoutingModule,
    SharedModule,
  ]
})
export class TutorWizardModule { }
