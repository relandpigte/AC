import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { AppRouteGuard } from '@shared/auth/auth-route-guard';

import { WrapperComponent } from '@app/layout/wrapper/wrapper.component';
import { CalendarComponent } from './calendar.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      ...['', ':user-id'].map(path => (
        {
          path,
          component: WrapperComponent,
          data: { permission: 'Pages.Calendar' },
          canActivate: [AppRouteGuard],
          canActivateChild: [AppRouteGuard],
          children: [
            {
              path: '',
              component: CalendarComponent,
            },
          ],
        } as Route
      )),
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class CalendarRoutingModule { }
