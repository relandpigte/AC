import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppRouteGuard } from '@shared/auth/auth-route-guard';

import { OverviewComponent } from './overview.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        // data: { permission: 'Pages.PageBuilder' },
        canActivate: [AppRouteGuard],
        canActivateChild: [AppRouteGuard],
        children: [
          {
            path: '',
            component: OverviewComponent,
          },
        ],
      }
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class OverviewRoutingModule { }
