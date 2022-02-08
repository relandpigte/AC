import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventsRoutingModule } from './events-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';

import { EventsComponent } from './events.component';

@NgModule({
  declarations: [
    EventsComponent,
  ],
  imports: [
    CommonModule,
    EventsRoutingModule,
    SharedModule,
    AppSharedModule,
  ],
})
export class EventsModule { }
