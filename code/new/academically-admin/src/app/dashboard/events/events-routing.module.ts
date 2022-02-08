import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { EventsComponent } from './events.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: EventsComponent,
      },
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class EventsRoutingModule { }
