import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppRouteGuard } from '@shared/auth/auth-route-guard';

import { AddressComponent } from './address.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: AddressComponent,
        data: { permission: 'Pages.TutorWizard.Address' },
        canActivate: [AppRouteGuard],
        canActivateChild: [AppRouteGuard],
      },
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class AddressRoutingModule { }
