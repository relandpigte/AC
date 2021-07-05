import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TutorApplicationsRoutingModule } from './tutor-applications-routing.module';
import { SharedModule } from '@shared/shared.module';

import { TutorApplicationsComponent } from './tutor-applications.component';

@NgModule({
  declarations: [
    TutorApplicationsComponent,
  ],
  imports: [
    CommonModule,
    TutorApplicationsRoutingModule,
    SharedModule,
  ]
})
export class TutorAppliactionsModule { }
