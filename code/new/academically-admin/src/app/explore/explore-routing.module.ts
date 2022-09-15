import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppRouteGuard } from '@shared/auth/auth-route-guard';

import { WrapperComponent } from '@app/layout/wrapper/wrapper.component';
import { ExploreComponent } from './explore.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: WrapperComponent,
        data: { permission: 'Pages.Home' },
        canActivate: [AppRouteGuard],
        canActivateChild: [AppRouteGuard],
        children: [
          {
            path: '',
            component: ExploreComponent,
            children: [
              {
                path: 'coaching',
                loadChildren: () =>
                  import('@app/explore/coaching/coaching.module').then(
                    (m) => m.ExploreCoachingModule
                  ),
              },
              {
                path: 'courses',
                loadChildren: () =>
                  import('@app/explore/courses/courses.module').then(
                    (m) => m.ExploreCoursesModule
                  ),
              },
              {
                path: 'events',
                loadChildren: () =>
                  import('@app/explore/events/events.module').then(
                    (m) => m.ExploreEventsModule
                  ),
              },
              {
                path: 'for-you',
                loadChildren: () =>
                  import('@app/explore/for-you/for-you.module').then(
                    (m) => m.ExploreForYouModule
                  ),
              },
              { path: '', redirectTo: 'for-you' },
              { path: '**', redirectTo: 'for-you' }
            ]
          }
        ]
      }
    ])
  ],
  exports: [
    RouterModule
  ],
})
export class ExploreRoutingModule { }
