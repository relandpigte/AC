import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssignmentsRoutingModule } from './assignments-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';

import { AssignmentsComponent } from './assignments.component';

@NgModule({
  declarations: [
    AssignmentsComponent,
  ],
  imports: [
    CommonModule,
    AssignmentsRoutingModule,
    SharedModule,
    AppSharedModule,
  ],
})
export class AssignmentsModule { }
