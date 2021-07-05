import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { AppRouteGuard } from '@shared/auth/auth-route-guard';

import { WrapperComponent } from '@app/layout/wrapper/wrapper.component';
import { TutorApplicationsComponent } from './tutor-applications.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: WrapperComponent,
        data: { permission: 'Pages.TutorApplications' },
        canActivate: [AppRouteGuard],
        canActivateChild: [AppRouteGuard],
        children: [
          {
            path: '',
            component: TutorApplicationsComponent,
            children: [
              {
                path: '',
                loadChildren: () =>
                  import('@app/tutor-applications/tutor-applications-list/tutor-applications-list.module').then(
                    (m) => m.TutorApplicationsListModule,
                  ),
              },
              {
                path: ':user-id',
                loadChildren: () =>
                  import('@app/tutor-applications/view-tutor-application/view-tutor-application.module').then(
                    (m) => m.ViewTutorApplicationModule,
                  ),
              },
            ]
          },
        ],
      }
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class TutorApplicationsRoutingModule { }
