import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppRouteGuard } from '@shared/auth/auth-route-guard';

import { TutorPortalComponent } from './tutor-portal.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: ':course-id',
        // data: { permission: 'Pages.PageBuilder' },
        canActivate: [AppRouteGuard],
        canActivateChild: [AppRouteGuard],
        children: [
          {
            path: '',
            component: TutorPortalComponent,
            children: [
              {
                path: 'overview',
                loadChildren: () =>
                  import('@app/tutor-portal/overview/overview.module').then(
                    (m) => m.OverviewModule,
                  ),
              },
              { path: '', redirectTo: 'overview' },
            ],
          },
        ],
      }
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class TutorPortalRoutingModule { }
