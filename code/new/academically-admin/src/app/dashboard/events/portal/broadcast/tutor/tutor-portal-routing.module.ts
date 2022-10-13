import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TutorPortalComponent } from './tutor-portal.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: TutorPortalComponent,
        children: [
          {
            path: 'overview',
            loadChildren: () =>
              import('@app/dashboard/events/portal/broadcast/tutor/overview/overview.module').then(
                (m) => m.OverviewModule,
              ),
          },
          {
            path: 'schedule',
            loadChildren: () =>
              import('@app/dashboard/events/portal/broadcast/tutor/schedule/schedule.module').then(
                (m) => m.ScheduleModule,
              ),
          },
          { path: '', redirectTo: 'overview' },
        ],
      }
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class TutorPortalRoutingModule { }
