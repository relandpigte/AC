import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppRouteGuard } from '@shared/auth/auth-route-guard';

import { GeneralComponent } from './general.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: GeneralComponent,
        data: { permission: 'Pages.AccountSettings' },
        canActivate: [AppRouteGuard],
        canActivateChild: [AppRouteGuard],
      },
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class GeneralRoutingModule { }
