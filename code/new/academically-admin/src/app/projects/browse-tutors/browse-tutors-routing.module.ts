import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppRouteGuard } from '@shared/auth/auth-route-guard';

import { BrowseTutorsComponent } from './browse-tutors.component';


@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: BrowseTutorsComponent,
        data: { permission: 'Pages.Projects.Hired' },
        canActivate: [AppRouteGuard],
        canActivateChild: [AppRouteGuard],
      },
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class BrowseTutorsRoutingModule { }
