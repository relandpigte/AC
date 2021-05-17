import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppRouteGuard } from '@shared/auth/auth-route-guard';
import { ProfilePictureComponent } from './profile-picture.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ProfilePictureComponent,
        data: { permission: 'Pages.TutorWizard.ProfilePicture' },
        canActivate: [AppRouteGuard],
        canActivateChild: [AppRouteGuard],
      },
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class ProfilePictureRoutingModule { }
