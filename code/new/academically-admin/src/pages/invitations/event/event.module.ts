import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventRoutingModule } from './event-routing.module';
import { SharedModule } from '@shared/shared.module';

import { EventComponent } from './event.component';

@NgModule({
  declarations: [
    EventComponent,
  ],
  imports: [
    CommonModule,
    EventRoutingModule,
    SharedModule,
  ],
})
export class EventModule { }
