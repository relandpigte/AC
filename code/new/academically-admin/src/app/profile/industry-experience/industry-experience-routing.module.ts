import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppRouteGuard } from '@shared/auth/auth-route-guard';

import { IndustryExperienceComponent } from './industry-experience.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: IndustryExperienceComponent,
        data: { permission: 'Pages.Profile.IndustryExperience' },
        canActivate: [AppRouteGuard],
        canActivateChild: [AppRouteGuard],
      },
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class IndustryExperienceRoutingModule { }
