import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppRouteGuard } from '@shared/auth/auth-route-guard';

import { AboutYouComponent } from './about-you.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: AboutYouComponent,
        data: { permission: 'Pages.TutorWizard.AboutYou' },
        canActivate: [AppRouteGuard],
        canActivateChild: [AppRouteGuard],
      },
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class AboutYouRoutingModule { }
