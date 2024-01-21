import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WrapperComponent } from '@app/layout/wrapper/wrapper.component';

import { CoachingComponent } from './coaching.component';
import { AppRouteGuard } from '@shared/auth/auth-route-guard';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: WrapperComponent,
        data: { permission: 'Pages.Dashboard' },
        canActivate: [AppRouteGuard],
        canActivateChild: [AppRouteGuard],
        children: [
          {
            path: '',
            component: CoachingComponent,
            data: { permission: 'Pages.Dashboard' }
          },
          {
            path: 'series',
            children: [
              {
                path: ':parent-id',
                loadChildren: () =>
                  import('@app/dashboard/coaching/series/series.module').then(
                    (m) => m.SeriesModule
                  ),
              }
            ]
          },
        ]
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
