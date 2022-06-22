import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WrapperComponent } from '@app/layout/wrapper/wrapper.component';

import { CoachingComponent } from './coaching.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: CoachingComponent,
        data: { permission: 'Pages.Dashboard' }
      },
      {
        path: ':id',
        loadChildren: () =>
          import('@app/dashboard/coaching/single/single.module').then(
            (m) => m.SingleModule,
          ),
      }
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class CoachingRoutingModule { }
