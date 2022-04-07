import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';
import {SavedComponent} from './saved.component';
import { GridComponent } from './grid/grid.component';
import { ListComponent } from './list/list.component';


@NgModule({
  declarations: [SavedComponent, GridComponent, ListComponent],
  imports: [
    CommonModule,
    SharedModule,
    AppSharedModule
  ],
  exports : [SavedComponent, GridComponent, ListComponent]
})
export class SavedModule { }
