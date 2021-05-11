import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TutorWizardRoutingModule } from './tutor-wizard-routing.module';
import { SharedModule } from '@shared/shared.module';

import { TutorWizardComponent } from './tutor-wizard.component';
import { AboutYouComponent } from './_components/about-you/about-you.component';

@NgModule({
  declarations: [
    TutorWizardComponent,
    AboutYouComponent,
  ],
  imports: [
    CommonModule,
    TutorWizardRoutingModule,
    SharedModule,
  ]
})
export class TutorWizardModule { }
