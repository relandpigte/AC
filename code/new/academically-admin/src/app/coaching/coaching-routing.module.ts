import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppRouteGuard } from '@shared/auth/auth-route-guard';
import { WrapperComponent } from '@app/layout/wrapper/wrapper.component';
import { CoachingComponent } from '@app/coaching/coaching.component';
import { HeaderComponent } from '@app/coaching/_components/header/header.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: WrapperComponent,
        data: { permission: 'Pages.Coaching' },
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
            component: CoachingComponent,
            children: [
              {
                path: 'about',
                loadChildren: () =>
                  import('@app/coaching/about/about.module').then(
                    (m) => m.CoachingAboutModule,
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
export class CoachingRoutingModule { }
