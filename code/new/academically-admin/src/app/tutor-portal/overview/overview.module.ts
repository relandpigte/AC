import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverviewRoutingModule } from './overview-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';

import { OverviewComponent } from './overview.component';
import { SectionStudentsComponent } from './_components/section-students/section-students.component';
import { SectionStudentsFullComponent } from './_components/section-students-full/section-students-full.component';

@NgModule({
  declarations: [
    OverviewComponent,
    SectionStudentsComponent,
    SectionStudentsFullComponent,
  ],
  imports: [
    CommonModule,
    OverviewRoutingModule,
    SharedModule,
    AppSharedModule,
  ],
})
export class OverviewModule { }
