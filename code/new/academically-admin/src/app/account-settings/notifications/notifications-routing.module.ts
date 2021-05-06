import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppRouteGuard } from '@shared/auth/auth-route-guard';

import { NotificationsComponent } from './notifications.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: NotificationsComponent,
        data: { permission: 'Pages.AccountSettings' },
        canActivate: [AppRouteGuard],
        canActivateChild: [AppRouteGuard],
      },
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class NotificationsRoutingModule { }
