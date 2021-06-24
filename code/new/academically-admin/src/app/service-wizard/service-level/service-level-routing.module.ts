import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppRouteGuard } from '@shared/auth/auth-route-guard';

import { ServiceLevelComponent } from './service-level.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ServiceLevelComponent,
        data: { permission: 'Pages.ServiceWizard.Level' },
        canActivate: [AppRouteGuard],
        canActivateChild: [AppRouteGuard],
      },
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class ServiceLevelRoutingModule { }
