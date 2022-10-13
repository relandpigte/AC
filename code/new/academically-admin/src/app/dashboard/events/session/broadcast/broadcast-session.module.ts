import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BroadcastSessionRoutingModule } from './broadcast-session-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';

import { BroadcastSessionComponent } from './broadcast-session.component';

@NgModule({
  declarations: [
    BroadcastSessionComponent,
  ],
  imports: [
    CommonModule,
    BroadcastSessionRoutingModule,
    SharedModule,
    AppSharedModule,
  ],
})
export class BroadcastSessionModule { }
