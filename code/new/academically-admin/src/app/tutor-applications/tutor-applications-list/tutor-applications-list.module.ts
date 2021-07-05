import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TutorApplicationsListRoutingModule } from './tutor-applications-list-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';

import { TutorApplicationsListComponent } from './tutor-applications-list.component';

@NgModule({
  declarations: [TutorApplicationsListComponent],
  imports: [
    CommonModule,
    TutorApplicationsListRoutingModule,
    SharedModule,
    AppSharedModule,
  ]
})
export class TutorApplicationsListModule { }
