import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { EventComponent } from './event.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: ':id',
        component: EventComponent,
      },
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class EventRoutingModule { }
