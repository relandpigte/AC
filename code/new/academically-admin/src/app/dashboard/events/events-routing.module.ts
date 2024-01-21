import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WrapperComponent } from '@app/layout/wrapper/wrapper.component';
import { AppRouteGuard } from '@shared/auth/auth-route-guard';

import { EventsComponent } from './events.component';

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
            component: EventsComponent,
            data: { permission: 'Pages.Dashboard' }
          },
          {
            path: 'broadcast/series',
            children: [
              {
                path: ':parent-id',
                loadChildren: () =>
                  import('@app/dashboard/events/details/broadcast/series/series.module').then(
                    (m) => m.SeriesModule
                  ),
              }
            ]
          },
          {
            path: 'workshop/series',
            children: [
              {
                path: ':parent-id',
                loadChildren: () =>
                  import('@app/dashboard/events/details/workshop/series/series.module').then(
                    (m) => m.SeriesModule
                  ),
              }
            ]
          },
          {
            path: 'portal/broadcast/tutor',
            data: { permission: 'Pages.Events' },
            canActivate: [AppRouteGuard],
            canActivateChild: [AppRouteGuard],
            children: [
              {
                path: ':id',
                loadChildren: () =>
                  import('@app/dashboard/events/portal/broadcast/tutor/tutor-portal.module').then(
                    (m) => m.TutorPortalModule
                  ),
              },
            ],
          },
          {
            path: 'session/broadcast',
            canActivate: [AppRouteGuard],
            canActivateChild: [AppRouteGuard],
            data: { permission: 'Pages.Events.StudentPortal' },
            loadChildren: () =>
              import('@app/dashboard/events/session/broadcast/broadcast-session.module').then(
                (m) => m.BroadcastSessionModule
              ),
          },
          { path: 'portal/workshop/tutor', redirectTo: 'portal/broadcast/tutor' },
          { path: 'portal/workshop/student', redirectTo: 'portal/broadcast/student' },
        ]
      },
      {
        path: 'portal/broadcast/student',
        canActivate: [AppRouteGuard],
        canActivateChild: [AppRouteGuard],
        data: { permission: 'Pages.Events.StudentPortal' },
        loadChildren: () =>
          import('@app/dashboard/events/portal/broadcast/student/student-portal.module').then(
            (m) => m.StudentPortalModule
          ),
      },
      {
        path: 'workshop/:id',
        loadChildren: () =>
          import('@app/dashboard/events/details/workshop/single/single.module').then(
            (m) => m.SingleModule,
          ),
      },
      {
        path: 'broadcast/:id',
        loadChildren: () =>
          import('@app/dashboard/events/details/broadcast/single/single.module').then(
            (m) => m.SingleModule,
          ),
      },
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class EventsRoutingModule { }
