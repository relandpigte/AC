import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppRouteGuard } from '@shared/auth/auth-route-guard';
import { ResearchComponent } from './research.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ResearchComponent,
        data: { permission: 'Pages.Profile.Research' },
        canActivate: [AppRouteGuard],
        canActivateChild: [AppRouteGuard],
      },
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class ResearchRoutingModule { }
