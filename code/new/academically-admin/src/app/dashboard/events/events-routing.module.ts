import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WrapperComponent } from '@app/layout/wrapper/wrapper.component';

import { EventsComponent } from './events.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: EventsComponent,
        data: { permission: 'Pages.Dashboard' }
      },
      {
        path: 'broadcast/:id',
        loadChildren: () =>
          import('@app/dashboard/events/details/broadcast/single/single.module').then(
            (m) => m.SingleModule,
          ),
      },
      {
        path: 'broadcast/series',
        children: [
          {
            path: ':parent-id',
            loadChildren: () =>
              import('@app/dashboard/events/details/broadcast/series/series.module').then(
                (m) => m.SeriesModule
              ),
          }
        ]
      },
      {
        path: 'workshop/:id',
        loadChildren: () =>
          import('@app/dashboard/events/details/workshop/single/single.module').then(
            (m) => m.SingleModule,
          ),
      },
      {
        path: 'workshop/series',
        children: [
          {
            path: ':parent-id',
            loadChildren: () =>
              import('@app/dashboard/events/details/workshop/series/series.module').then(
                (m) => m.SeriesModule
              ),
          }
        ]
      },
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class EventsRoutingModule { }
