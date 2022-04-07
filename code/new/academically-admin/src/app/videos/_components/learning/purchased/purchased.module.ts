import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';
import { GridComponent } from './grid/grid.component';
import { ListComponent } from './list/list.component';
import {PurchasedComponent} from './purchased.component';



@NgModule({
  declarations: [PurchasedComponent , GridComponent, ListComponent],
  imports: [
    CommonModule,
    SharedModule,
    AppSharedModule
  ], exports : [PurchasedComponent , GridComponent, ListComponent]
})
export class PurchasedModule { }
