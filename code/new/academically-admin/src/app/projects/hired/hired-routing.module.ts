import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppRouteGuard } from '@shared/auth/auth-route-guard';

import { HiredComponent } from './hired.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: HiredComponent,
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
export class HiredRoutingModule { }
