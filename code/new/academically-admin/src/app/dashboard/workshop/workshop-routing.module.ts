import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WrapperComponent } from '@app/layout/wrapper/wrapper.component';

import { WorkshopComponent } from './workshop.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: WorkshopComponent,
        data: { permission: 'Pages.Dashboard' }
      },
      {
        path: ':id',
        loadChildren: () =>
          import('@app/dashboard/workshop/single/single.module').then(
            (m) => m.SingleModule,
          ),
      }
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class WorkshopRoutingModule { }
