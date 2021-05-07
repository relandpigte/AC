import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { AppRouteGuard } from '@shared/auth/auth-route-guard';

import { ServiceSubjectsComponent } from './service-subjects.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      ...['', ':service-name'].map(path => (
        {
          path,
          component: ServiceSubjectsComponent,
          data: { permission: 'Pages.Suggestions.ServiceSubjects' },
          canActivate: [AppRouteGuard],
          canActivateChild: [AppRouteGuard],
        } as Route
      )),
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class ServiceSubjectsRoutingModule { }
