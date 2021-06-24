import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServiceWizardRoutingModule } from './service-wizard-routing.module';
import { SharedModule } from '@shared/shared.module';

import { ServiceWizardComponent } from './service-wizard.component';

@NgModule({
  declarations: [
    ServiceWizardComponent,
  ],
  imports: [
    CommonModule,
    ServiceWizardRoutingModule,
    SharedModule,
  ]
})
export class ServiceWizardModule { }
