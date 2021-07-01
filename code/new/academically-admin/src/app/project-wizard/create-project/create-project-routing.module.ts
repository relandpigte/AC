import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppRouteGuard } from '@shared/auth/auth-route-guard';

import { CreateProjectComponent } from './create-project.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: CreateProjectComponent,
        data: { permission: 'Pages.ServiceWizard.CreateProject' },
        canActivate: [AppRouteGuard],
        canActivateChild: [AppRouteGuard],
      },
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class CreateProjectRoutingModule { }
