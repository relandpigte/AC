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
            path: 'coachings',
            loadChildren: () =>
              import('@app/dashboard/coaching/series/coachings/coachings.module').then(
                (m) => m.CoachingsModule
              ),
          },
          {
            path: 'details',
            loadChildren: () =>
              import('@app/dashboard/coaching/series/details/details.module').then(
                (m) => m.DetailsModule
              ),
          },
          {
            path: 'settings',
            loadChildren: () =>
              import('@app/dashboard/coaching/series/settings/settings.module').then(
                (m) => m.SettingsModule
              ),
          },
          { path: '', redirectTo: 'coachings' },
        ]
      },
      {
        path: ':id',
        loadChildren: () =>
          import('@app/dashboard/coaching/single/single.module').then(
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
