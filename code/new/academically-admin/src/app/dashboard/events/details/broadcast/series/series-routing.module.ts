import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SeriesComponent } from './series.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: SeriesComponent,
        children: [
          {
            path: 'broadcasts',
            loadChildren: () =>
              import('@app/dashboard/events/details/broadcast/series/broadcasts/broadcasts.module').then(
                (m) => m.BroadcastsModule
              ),
          },
          {
            path: 'details',
            loadChildren: () =>
              import('@app/dashboard/events/details/broadcast/series/details/details.module').then(
                (m) => m.DetailsModule
              ),
          },
          {
            path: 'settings',
            loadChildren: () =>
              import('@app/dashboard/events/details/broadcast/series/settings/settings.module').then(
                (m) => m.SettingsModule
              ),
          },
          { path: '', redirectTo: 'events' },
        ]
      },
      {
        path: ':id',
        loadChildren: () =>
          import('@app/dashboard/events/details/broadcast/single/single.module').then(
            (m) => m.SingleModule
          ),
      },
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class SeriesRoutingModule { }
