import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { OverviewComponent } from './overview.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: OverviewComponent,
      }
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class OverviewRoutingModule { }
