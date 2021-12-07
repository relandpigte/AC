import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssignmentsRoutingModule } from './assignments-routing.module';

import { AssignmentsComponent } from './assignments.component';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';
import { CreateEditComponent } from './_components/create-edit/create-edit.component';

@NgModule({
  declarations: [
    AssignmentsComponent,
    CreateEditComponent,
  ],
  imports: [
    CommonModule,
    AssignmentsRoutingModule,
    SharedModule,
    AppSharedModule,
  ],
})
export class AssignmentsModule { }
