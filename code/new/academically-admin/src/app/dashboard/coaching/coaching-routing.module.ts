import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CoachingComponent } from './coaching.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: CoachingComponent,
      },
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class CoachingRoutingModule { }
