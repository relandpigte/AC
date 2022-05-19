import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';

import { ScheduleListComponent } from './schedule-list.component';
import { GridComponent } from './grid/grid.component';
import { ListComponent } from './list/list.component';

@NgModule({
  declarations: [
    ScheduleListComponent,
    GridComponent,
    ListComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    AppSharedModule,
  ],
  exports: [
    ScheduleListComponent,
    GridComponent,
    ListComponent,
  ]
})
export class ScheduleListModule { }
