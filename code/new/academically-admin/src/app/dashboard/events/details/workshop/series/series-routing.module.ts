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
            path: 'workshops',
            loadChildren: () =>
              import('@app/dashboard/events/details/workshop/series/workshops/workshops.module').then(
                (m) => m.WorkshopsModule
              ),
          },
          {
            path: 'details',
            loadChildren: () =>
              import('@app/dashboard/events/details/workshop/series/details/details.module').then(
                (m) => m.DetailsModule
              ),
          },
          {
            path: 'settings',
            loadChildren: () =>
              import('@app/dashboard/events/details/workshop/series/settings/settings.module').then(
                (m) => m.SettingsModule
              ),
          },
          { path: '', redirectTo: 'workshops' },
        ]
      },
      {
        path: ':id',
        loadChildren: () =>
          import('@app/dashboard/events/details/workshop/single/single.module').then(
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
