import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppSharedModule } from '@app/_shared/app-shared.module';
import { SharedModule } from '@shared/shared.module';

import { EditHistoryComponent } from './edit-history.component';
import { EditHistoryRoutingModule } from './edit-history-routing.module';

@NgModule({
  declarations: [
    EditHistoryComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AppSharedModule,
    EditHistoryRoutingModule
  ],
  exports: [
    EditHistoryComponent
  ]
})
export class EditHistoryModule { }
