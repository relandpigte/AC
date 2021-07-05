import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { AppRouteGuard } from '@shared/auth/auth-route-guard';

import { TutorApplicationsListComponent } from './tutor-applications-list.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: TutorApplicationsListComponent,
        data: { permission: 'Pages.TutorApplications.List' },
        canActivate: [AppRouteGuard],
        canActivateChild: [AppRouteGuard],
      }
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class TutorApplicationsListRoutingModule { }
