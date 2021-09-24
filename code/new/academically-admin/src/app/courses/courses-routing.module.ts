import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppRouteGuard } from '@shared/auth/auth-route-guard';

import { WrapperComponent } from '@app/layout/wrapper/wrapper.component';
import { CoursesComponent } from './courses.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: ':id',
        component: WrapperComponent,
        data: { permission: 'Pages.Conversations' },
        canActivate: [AppRouteGuard],
        canActivateChild: [AppRouteGuard],
        children: [
          {
            path: '',
            component: CoursesComponent,
          },
        ],
      }
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class CoursesRoutingModule { }
