import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppRouteGuard } from '@shared/auth/auth-route-guard';

import { ReferencesComponent } from './references.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ReferencesComponent,
        data: { permission: 'Pages.TutorWizard.References' },
        canActivate: [AppRouteGuard],
        canActivateChild: [AppRouteGuard],
      },
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class ReferencesRoutingModule { }
