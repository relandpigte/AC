import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';
import {PurchasedComponent} from './purchased.component';
import { GridComponent } from './grid/grid.component';
import { ListComponent } from './list/list.component';


@NgModule({
  declarations: [PurchasedComponent, GridComponent, ListComponent],
  imports: [
    CommonModule,
    SharedModule,
    AppSharedModule,
  ], exports : [PurchasedComponent, GridComponent, ListComponent]
})
export class PurchasedModule { }
