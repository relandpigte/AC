import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppRouteGuard } from '@shared/auth/auth-route-guard';

import { DeclarationComponent } from './declaration.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: DeclarationComponent,
        data: { permission: 'Pages.TutorWizard.Declaration' },
        canActivate: [AppRouteGuard],
        canActivateChild: [AppRouteGuard],
      },
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class DeclarationRoutingModule { }
