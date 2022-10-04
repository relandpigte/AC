import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppSharedModule } from '@app/_shared/app-shared.module';
import { SharedModule } from '@shared/shared.module';
import { EventsRoutingModule } from './events-routing.module';

import { ExploreEventsComponent } from './events.component';

@NgModule({
  declarations: [
    ExploreEventsComponent,
  ],
  imports: [
    CommonModule,
    EventsRoutingModule,
    SharedModule,
    AppSharedModule,
  ],
  exports: [
    ExploreEventsComponent
  ]
})
export class ExploreEventsModule { }
