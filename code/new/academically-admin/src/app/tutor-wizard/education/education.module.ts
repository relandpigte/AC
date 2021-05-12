import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EducationRoutingModule } from './education-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';

import { EducationComponent } from './education.component';

@NgModule({
  declarations: [
    EducationComponent,
  ],
  imports: [
    CommonModule,
    EducationRoutingModule,
    SharedModule,
    AppSharedModule,
  ]
})
export class EducationModule { }
