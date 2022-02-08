import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppRouteGuard } from '@shared/auth/auth-route-guard';

import { WrapperComponent } from '@app/layout/wrapper/wrapper.component';
import { DashboardComponent } from './dashboard.component';

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
            path: 'overview',
            component: DashboardComponent,
          },
          {
            path: 'usage',
            loadChildren: () =>
              import('@app/dashboard/usage/usage.module').then(
                (m) => m.UsageModule
              ),
          },
          {
            path: 'courses',
            loadChildren: () =>
              import('@app/dashboard/courses/courses.module').then(
                (m) => m.CoursesModule
              ),
          },
          {
            path: 'coaching',
            loadChildren: () =>
              import('@app/dashboard/coaching/coaching.module').then(
                (m) => m.CoachingModule
              ),
          },
          {
            path: 'events',
            loadChildren: () =>
              import('@app/dashboard/events/events.module').then(
                (m) => m.EventsModule
              ),
          },
        ],
      }
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class DashboardRoutingModule { }
