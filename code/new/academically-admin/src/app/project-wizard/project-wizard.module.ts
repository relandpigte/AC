import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServiceWizardRoutingModule } from './project-wizard-routing.module';
import { SharedModule } from '@shared/shared.module';

import { ProjectWizardComponent } from './project-wizard.component';

@NgModule({
  declarations: [
    ProjectWizardComponent,
  ],
  imports: [
    CommonModule,
    ServiceWizardRoutingModule,
    SharedModule,
  ]
})
export class ProjectWizardModule { }
