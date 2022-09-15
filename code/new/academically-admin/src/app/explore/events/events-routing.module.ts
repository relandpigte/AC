import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ExploreEventsComponent } from './events.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ExploreEventsComponent,
      }
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class EventsRoutingModule { }
