import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppRouteGuard } from '@shared/auth/auth-route-guard';

import { ContactNumberComponent } from './contact-number.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ContactNumberComponent,
        data: { permission: 'Pages.TutorWizard.ContactNumber' },
        canActivate: [AppRouteGuard],
        canActivateChild: [AppRouteGuard],
      },
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class ContactNumberRoutingModule { }
