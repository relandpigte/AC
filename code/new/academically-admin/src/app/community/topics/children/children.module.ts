import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppSharedModule } from '@app/_shared/app-shared.module';
import { SharedModule } from '@shared/shared.module';

import { ChildrenComponent } from './children.component';
import { ChildrenRoutingModule } from './children-routing.module';

@NgModule({
  declarations: [
    ChildrenComponent
  ],
  imports: [
    CommonModule,
    ChildrenRoutingModule,
    SharedModule,
    AppSharedModule,
  ],
  exports: [
    ChildrenComponent
  ]
})
export class ChildrenModule { }
