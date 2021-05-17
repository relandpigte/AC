import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppRouteGuard } from '@shared/auth/auth-route-guard';

import { PhotoIdComponent } from './photo-id.component';


@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: PhotoIdComponent,
        data: { permission: 'Pages.TutorWizard.PhotoId' },
        canActivate: [AppRouteGuard],
        canActivateChild: [AppRouteGuard],
      },
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class PhotoIdRoutingModule { }
