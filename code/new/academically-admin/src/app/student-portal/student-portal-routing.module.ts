import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppRouteGuard } from '@shared/auth/auth-route-guard';
import { StudentPortalRouteGuard } from './_guards/student-portal-route.guard';

import { StudentPortalComponent } from './student-portal.component';
import { LayoutComponent } from './_components/layout/layout.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: ':course-id',
        data: { permission: 'Pages.StudentPortal' },
        canActivate: [AppRouteGuard],
        canActivateChild: [AppRouteGuard],
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
                  import('@app/student-portal/landing-page/landing-page.module').then(
                    (m) => m.LandingPageModule,
                  ),
              },
              {
                path: '',
                component: LayoutComponent,
                canActivate: [StudentPortalRouteGuard],
                children: [
                  {
                    path: 'home',
                    loadChildren: () =>
                      import('@app/student-portal/home/home.module').then(
                        (m) => m.HomeModule,
                      ),
                  },
                ]
              },
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
