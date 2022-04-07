import { NgModule, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoursesRoutingModule } from './courses-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';

import { CoursesComponent } from './courses.component';
import { GridComponent } from './grid/grid.component';
import { ListComponent } from './list/list.component';

@NgModule({
  declarations: [
    CoursesComponent,
    GridComponent,
    ListComponent,
  ],
  imports: [
    CommonModule,
    CoursesRoutingModule,
    SharedModule,
    AppSharedModule,
  ],
})
export class CoursesModule { }
