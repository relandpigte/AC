import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppRouteGuard } from '@shared/auth/auth-route-guard';

import { EducationComponent } from './education.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: EducationComponent,
        canActivate: [AppRouteGuard],
        canActivateChild: [AppRouteGuard],
      },
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class EducationRoutingModule { }
