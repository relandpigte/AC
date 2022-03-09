import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentPortalRoutingModule } from './student-portal-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';

import { StudentPortalComponent } from './student-portal.component';

@NgModule({
  declarations: [
    StudentPortalComponent,
  ],
  imports: [
    CommonModule,
    StudentPortalRoutingModule,
    SharedModule,
    AppSharedModule,
  ],
})
export class StudentPortalModule { }
