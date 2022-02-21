import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WrapperComponent } from '@app/layout/wrapper/wrapper.component';

import { EventsComponent } from './events.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: WrapperComponent,
        data: { permission: 'Pages.Dashboard' },
        children: [
          {
            path: '',
            component: EventsComponent,
          },
          {
            path: ':id',
            loadChildren: () =>
              import('@app/events/single-event/single-event.module').then(
                (m) => m.SingleEventModule,
              ),
          },
          {
            path: 'event-series',
            children: [
              {
                path: ':parent-id',
                loadChildren: () =>
                  import('@app/events/event-series/event-series.module').then(
                    (m) => m.EventSeriesModule
                  ),
              }
            ]
          },
        ],
      }
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class EventsRoutingModule { }
