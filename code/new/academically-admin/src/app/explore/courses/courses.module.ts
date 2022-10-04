import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppSharedModule } from '@app/_shared/app-shared.module';
import { SharedModule } from '@shared/shared.module';
import { CoursesRoutingModule } from './courses-routing.module';

import { ExploreCoursesComponent } from './courses.component';

@NgModule({
  declarations: [
    ExploreCoursesComponent,
  ],
  imports: [
    CommonModule,
    CoursesRoutingModule,
    SharedModule,
    AppSharedModule,
  ],
  exports: [
    ExploreCoursesComponent
  ]
})
export class ExploreCoursesModule { }
