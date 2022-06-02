import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppRouteGuard } from '@shared/auth/auth-route-guard';

import { DetailsComponent } from './details.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: DetailsComponent,
        data: { permission: 'Pages.Projects.Hired' },
        canActivate: [AppRouteGuard],
        canActivateChild: [AppRouteGuard],
      },
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class DetailsRoutingModule { }
