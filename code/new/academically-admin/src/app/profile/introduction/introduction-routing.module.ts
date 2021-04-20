import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppRouteGuard } from '@shared/auth/auth-route-guard';

import { IntroductionComponent } from './introduction.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: IntroductionComponent,
        data: { permission: 'Pages.Profile.Introduction' },
        canActivate: [AppRouteGuard],
        canActivateChild: [AppRouteGuard],
      },
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class IntroductionRoutingModule { }
