import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BroadcastSessionComponent } from './broadcast-session.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: ':event-id',
        component: BroadcastSessionComponent,
      },
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class BroadcastSessionRoutingModule { }
