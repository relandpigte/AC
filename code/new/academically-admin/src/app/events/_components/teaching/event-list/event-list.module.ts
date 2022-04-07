import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';
import {EventListComponent} from './event-list.component';
import { GridComponent } from './grid/grid.component';
import { ListComponent } from './list/list.component';


@NgModule({
  declarations: [EventListComponent, GridComponent, ListComponent],
  imports: [
    CommonModule,
    SharedModule,
    AppSharedModule,
  ], exports : [EventListComponent , GridComponent, ListComponent]
})
export class EventListModule { }
