import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ProgressComponent } from './progress.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        children: [
          {
            path: '',
            component: ProgressComponent,
          },
        ],
      }
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class ProgressRoutingModule { }
