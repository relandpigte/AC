import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppRouteGuard } from '@shared/auth/auth-route-guard';
import { StudentPortalRouteGuard } from './_guards/student-portal-route.guard';

import { StudentPortalComponent } from './student-portal.component';
// import { LayoutComponent } from './_components/layout/layout.component';
// import { PortalMenuComponent } from './_components/portal-menu/portal-menu.component';
// import { CourseMenuComponent } from './_components/course-menu/course-menu.component';
// import { DiscussionsComponent } from './_components/discussions/discussions.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: ':video-id',
        data: { permission: 'Pages.StudentPortal' },
        canActivate: [AppRouteGuard],
        canActivateChild: [AppRouteGuard],
        children: [
          {
            path: '',
            component: StudentPortalComponent,
            canActivate: [StudentPortalRouteGuard],
            children: [
              {
                path: 'landing-page',
                loadChildren: () =>
                  import('@app/videos/student-portal/landing-page/landing-page.module').then(
                    (m) => m.LandingPageModule,
                  ),
              },
              {
                path: 'portal',
                loadChildren: () =>
                  import('@app/videos/student-portal/portal/portal.module').then(
                    (m) => m.PortalModule,
                  ),
              },
              { path: '', redirectTo: 'portal' },
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
