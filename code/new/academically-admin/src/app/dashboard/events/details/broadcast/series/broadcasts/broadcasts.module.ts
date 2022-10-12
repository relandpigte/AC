import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BroadcastsRoutingModule } from './broadcasts-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';

import { BroadcastsComponent } from './broadcasts.component';

@NgModule({
  declarations: [
    BroadcastsComponent,
  ],
  imports: [
    CommonModule,
    BroadcastsRoutingModule,
    SharedModule,
    AppSharedModule,
  ],
})
export class BroadcastsModule { }
