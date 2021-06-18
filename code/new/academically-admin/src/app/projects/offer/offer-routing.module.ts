import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppRouteGuard } from '@shared/auth/auth-route-guard';

import { OfferComponent } from './offer.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: OfferComponent,
        data: { permission: 'Pages.Projects.Offer' },
        canActivate: [AppRouteGuard],
        canActivateChild: [AppRouteGuard],
      },
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class OfferRoutingModule { }
