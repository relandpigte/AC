import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { WorkshopsComponent } from './workshops.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: WorkshopsComponent,
      },
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class WorkshopsRoutingModule { }
