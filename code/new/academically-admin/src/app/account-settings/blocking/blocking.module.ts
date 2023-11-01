import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlockingRoutingModule } from './blocking-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';
import { BlockingComponent } from '@app/account-settings/blocking/blocking.component';

@NgModule({
  declarations: [BlockingComponent],
  imports: [
    CommonModule,
    BlockingRoutingModule,
    SharedModule,
    AppSharedModule
  ]
})
export class BlockingModule { }
