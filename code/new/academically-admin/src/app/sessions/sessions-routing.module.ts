import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppRouteGuard } from '@shared/auth/auth-route-guard';

import { SessionsComponent } from './sessions.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: ':calendar-event-id',
        component: SessionsComponent,
        canActivate: [AppRouteGuard],
        canActivateChild: [AppRouteGuard],
      }
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class SessionsRoutingModule { }
