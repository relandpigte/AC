import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { EventSessionComponent } from './event-session.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: ':event-id',
        component: EventSessionComponent,
      },
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class EventSessionRoutingModule { }
