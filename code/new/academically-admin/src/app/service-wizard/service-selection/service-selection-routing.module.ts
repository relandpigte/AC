import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppRouteGuard } from '@shared/auth/auth-route-guard';

import { ServiceSelectionComponent } from './service-selection.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ServiceSelectionComponent,
        data: { permission: 'Pages.ServiceWizard.Services' },
        canActivate: [AppRouteGuard],
        canActivateChild: [AppRouteGuard],
      },
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class ServiceSelectionRoutingModule { }
