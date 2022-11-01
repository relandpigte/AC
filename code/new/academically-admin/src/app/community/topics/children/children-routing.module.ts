import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ChildrenComponent } from './children.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ChildrenComponent
      }
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class ChildrenRoutingModule { }
