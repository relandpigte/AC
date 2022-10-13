import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppRouteGuard } from '@shared/auth/auth-route-guard';
import { StudentPortalRouteGuard } from './_guards/student-portal-route.guard';

import { StudentPortalComponent } from './student-portal.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: ':event-id',
        children: [
          {
            path: '',
            component: StudentPortalComponent,
            canActivate: [StudentPortalRouteGuard],
            children: [
              { path: '', redirectTo: 'landing-page' },
              {
                path: 'landing-page',
                loadChildren: () =>
                  import('@app/dashboard/events/portal/broadcast/student/landing-page/landing-page.module').then(
                    (m) => m.LandingPageModule,
                  ),
              },
              {
                path: 'portal',
                loadChildren: () =>
                  import('@app/dashboard/events/portal/broadcast/student/portal/portal.module').then(
                    (m) => m.PortalModule,
                  ),
              }
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
export class StudentPortalRoutingModule { }
