import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppRouteGuard } from '@shared/auth/auth-route-guard';

import { WrapperComponent } from '@app/layout/wrapper/wrapper.component';
import { HomeComponent } from './home.component';

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
            component: HomeComponent,
            children: [
              {
                path: 'home',
                loadChildren: () =>
                  import('@app/home/home/home.module').then(
                    (m) => m.HomeModule
                  ),
              },
              {
                path: 'courses',
                loadChildren: () =>
                  import('@app/home/courses/courses.module').then(
                    (m) => m.CoursesModule
                  ),
              },
              { path: '', redirectTo: 'home' },
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
export class HomeRoutingModule { }
