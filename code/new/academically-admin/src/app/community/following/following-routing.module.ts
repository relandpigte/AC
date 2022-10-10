import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FollowingComponent } from './following.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: FollowingComponent,
      }
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class FollowingRoutingModule { }
