import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LearnComponent } from './learn.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        children: [
          {
            path: '',
            component: LearnComponent,
          },
        ],
      }
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class LearnRoutingModule { }
