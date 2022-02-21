import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SingleEventComponent } from './single-event.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: SingleEventComponent,
        children: [
          {
            path: 'details',
            loadChildren: () =>
              import('@app/events/single-event/details/details.module').then(
                (m) => m.DetailsModule
              ),
          },
          {
            path: 'settings',
            loadChildren: () =>
              import('@app/events/single-event/settings/settings.module').then(
                (m) => m.SettingsModule
              ),
          },
          { path: '', redirectTo: 'details' },
        ]
      }
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class SingleEventRoutingModule { }
