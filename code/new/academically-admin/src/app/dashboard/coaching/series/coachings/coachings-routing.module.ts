import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CoachingsComponent } from './coachings.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: CoachingsComponent,
      },
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class CoachingsRoutingModule { }
