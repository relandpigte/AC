import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppRouteGuard } from '@shared/auth/auth-route-guard';

import { LanguagesComponent } from './languages.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: LanguagesComponent,
        data: { permission: 'Pages.TutorWizard.Languages' },
        canActivate: [AppRouteGuard],
        canActivateChild: [AppRouteGuard],
      },
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class LanguagesRoutingModule { }
