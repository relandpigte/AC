import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppRouteGuard } from '@shared/auth/auth-route-guard';
import { StudentPortalRouteGuard } from './_guards/student-portal-route.guard';

import { StudentPortalComponent } from './student-portal.component';
import { LayoutComponent } from './_components/layout/layout.component';
import { PortalMenuComponent } from './_components/portal-menu/portal-menu.component';
import { CourseMenuComponent } from './_components/course-menu/course-menu.component';
import { DiscussionsComponent } from './_components/discussions/discussions.component';

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
                    path: '',
                    component: PortalMenuComponent,
                    outlet: 'menu',
                  },
                  {
                    path: 'home',
                    loadChildren: () =>
                      import('@app/student-portal/home/home.module').then(
                        (m) => m.HomeModule,
                      ),
                  },
                  {
                    path: 'messages',
                    loadChildren: () =>
                      import('@app/student-portal/messages/messages.module').then(
                        (m) => m.MessagesModule,
                      ),
                  },
                ]
              },
              {
                path: '',
                component: LayoutComponent,
                canActivate: [StudentPortalRouteGuard],
                children: [
                  {
                    path: '',
                    component: CourseMenuComponent,
                    outlet: 'menu',
                  },
                  {
                    path: '',
                    component: DiscussionsComponent,
                    outlet: 'rightbar',
                  },
                  {
                    path: 'learn',
                    loadChildren: () =>
                      import('@app/student-portal/learn/learn.module').then(
                        (m) => m.LearnModule,
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
