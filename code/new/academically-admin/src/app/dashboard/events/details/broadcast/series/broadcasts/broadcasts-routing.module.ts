import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BroadcastsComponent } from './broadcasts.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: BroadcastsComponent,
      },
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class BroadcastsRoutingModule { }
