import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppRouteGuard } from '@shared/auth/auth-route-guard';

import { StudentPortalComponent } from './student-portal.component';

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
