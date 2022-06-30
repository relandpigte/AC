import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventSessionRoutingModule } from './event-session-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';

import { EventSessionComponent } from './event-session.component';

@NgModule({
  declarations: [
    EventSessionComponent,
  ],
  imports: [
    CommonModule,
    EventSessionRoutingModule,
    SharedModule,
    AppSharedModule,
  ],
})
export class EventSessionModule { }
