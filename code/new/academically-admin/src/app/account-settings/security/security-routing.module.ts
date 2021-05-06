import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppRouteGuard } from '@shared/auth/auth-route-guard';

import { SecurityComponent } from './security.component';


@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: SecurityComponent,
        data: { permission: 'Pages.AccountSettings.Security' },
        canActivate: [AppRouteGuard],
        canActivateChild: [AppRouteGuard],
      },
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class SecurityRoutingModule { }
