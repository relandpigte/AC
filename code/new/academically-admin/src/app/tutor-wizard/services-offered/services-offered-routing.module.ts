import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppRouteGuard } from '@shared/auth/auth-route-guard';

import { ServicesOfferedComponent } from './services-offered.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ServicesOfferedComponent,
        data: { permission: 'Pages.TutorWizard.ServicesOffered' },
        canActivate: [AppRouteGuard],
        canActivateChild: [AppRouteGuard],
      },
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class ServicesOfferedRoutingModule { }
