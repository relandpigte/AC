import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DbsCheckRoutingModule } from './dbs-check-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';

import { DbsCheckComponent } from './dbs-check.component';

@NgModule({
  declarations: [
    DbsCheckComponent,
  ],
  imports: [
    CommonModule,
    DbsCheckRoutingModule,
    SharedModule,
    AppSharedModule,
  ],
})
export class DbsCheckModule { }
