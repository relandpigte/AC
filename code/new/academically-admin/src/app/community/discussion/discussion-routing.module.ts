import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DiscussionComponent } from './discussion.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: DiscussionComponent,
      }
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class DiscussionRoutingModule { }
