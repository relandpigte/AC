import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppRouteGuard } from '@shared/auth/auth-route-guard';
import { WrapperComponent } from '@app/layout/wrapper/wrapper.component';
import { EventsComponent } from '@app/events/events.component';
import { HeaderComponent } from '@app/events/_components/header/header.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: WrapperComponent,
        canActivate: [AppRouteGuard],
        canActivateChild: [AppRouteGuard],
        children: [
          {
            path: '',
            component: HeaderComponent,
            outlet: 'header',
          },
          {
            path: '',
            component: EventsComponent,
            children: [
              {
                path: 'about',
                loadChildren: () =>
                  import('@app/events/about/about.module').then(
                    (m) => m.EventsAboutModule,
                  ),
              },
              {
                path: 'discussion',
                loadChildren: () =>
                  import('@app/events/discussion/discussion.module').then(
                    (m) => m.EventsDiscussionModule,
                  ),
              },
              {
                path: 'reviews',
                loadChildren: () =>
                  import('@app/events/reviews/reviews.module').then(
                    (m) => m.EventsReviewsModule,
                  ),
              },
              { path: '', redirectTo: 'about' },
              { path: '**', redirectTo: 'about' },
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
export class EventsRoutingModule { }
