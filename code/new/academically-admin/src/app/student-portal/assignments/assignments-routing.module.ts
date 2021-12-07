import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AssignmentsComponent } from './assignments.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: AssignmentsComponent,
      }
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class AssignmentsRoutingModule { }
