import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppRouteGuard } from '@shared/auth/auth-route-guard';

import { WrapperComponent } from '@app/layout/wrapper/wrapper.component';
import { TutorWizardComponent } from './tutor-wizard.component';


@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: WrapperComponent,
        data: { permission: 'Pages.TutorWizard' },
        canActivate: [AppRouteGuard],
        canActivateChild: [AppRouteGuard],
        children: [
          {
            path: '',
            component: TutorWizardComponent,
          },
        ],
      }
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class TutorWizardRoutingModule { }
