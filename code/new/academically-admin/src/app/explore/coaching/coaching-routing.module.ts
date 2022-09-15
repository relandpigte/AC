import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ExploreCoachingComponent } from './coaching.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ExploreCoachingComponent,
      }
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class CoachingRoutingModule { }
