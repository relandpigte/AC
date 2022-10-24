import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AllComponent } from './all.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: AllComponent,
      }
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class AllRoutingModule { }
