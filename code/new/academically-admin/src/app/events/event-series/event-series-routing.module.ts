import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { EventSeriesComponent } from './event-series.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: EventSeriesComponent,
        children: [
          {
            path: 'events',
            loadChildren: () =>
              import('@app/events/event-series/events/events.module').then(
                (m) => m.EventsModule
              ),
          },
          {
            path: 'details',
            loadChildren: () =>
              import('@app/events/event-series/details/details.module').then(
                (m) => m.DetailsModule
              ),
          },
          // {
          //   path: 'settings',
          //   loadChildren: () =>
          //     import('@app/articles/article-series/settings/settings.module').then(
          //       (m) => m.SettingsModule
          //     ),
          // },
          { path: '', redirectTo: 'events' },
        ]
      },
      {
        path: ':id',
        loadChildren: () =>
          import('@app/events/single-event/single-event.module').then(
            (m) => m.SingleEventModule
          ),
      },
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class EventSeriesRoutingModule { }
