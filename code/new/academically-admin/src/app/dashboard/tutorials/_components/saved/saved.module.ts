import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';
import {SavedComponent} from './saved.component';
import {ListComponent} from './list/list.component';
import {GridComponent} from './grid/grid.component';

@NgModule({
  declarations: [SavedComponent, ListComponent , GridComponent],
  imports: [
    CommonModule,
    SharedModule,
    AppSharedModule
  ],
  exports : [SavedComponent, ListComponent , GridComponent]
})
export class SavedModule { }
