import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppRouteGuard } from '@shared/auth/auth-route-guard';

import { DbsCheckComponent } from './dbs-check.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: DbsCheckComponent,
        data: { permission: 'Pages.TutorWizard.DbsCheck' },
        canActivate: [AppRouteGuard],
        canActivateChild: [AppRouteGuard],
      },
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class DbsCheckRoutingModule { }
