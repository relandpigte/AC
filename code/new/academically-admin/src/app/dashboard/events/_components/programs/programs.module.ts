import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';
import { ProgramsComponent } from './programs.component';
import { GridComponent } from './grid/grid.component';
import { ListComponent } from './list/list.component';


@NgModule({
  declarations: [ProgramsComponent, GridComponent, ListComponent],
  imports: [
    CommonModule,
    SharedModule,
    AppSharedModule,
  ], exports : [ProgramsComponent , GridComponent, ListComponent]
})
export class ProgramsModule { }
