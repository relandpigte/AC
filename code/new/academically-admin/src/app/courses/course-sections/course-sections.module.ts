import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseSectionsRoutingModule } from './course-sections-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';

import { CourseSectionsComponent } from './course-sections.component';

@NgModule({
  declarations: [
    CourseSectionsComponent,
  ],
  imports: [
    CommonModule,
    CourseSectionsRoutingModule,
    SharedModule,
    AppSharedModule,
  ],
})
export class CourseSectionsModule { }
