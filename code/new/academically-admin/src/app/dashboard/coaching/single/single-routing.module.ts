import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SingleComponent } from './single.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: SingleComponent,
        children: [
          {
            path: 'details',
            loadChildren: () =>
              import('@app/dashboard/coaching/single/details/details.module').then(
                (m) => m.DetailsModule
              ),
          },
          {
            path: 'settings',
            loadChildren: () =>
              import('@app/dashboard/coaching/single/settings/settings.module').then(
                (m) => m.SettingsModule
              ),
          },
          {
            path: 'studios',
            loadChildren: () =>
              import('@app/dashboard/coaching/single/studio/studio.module').then(
                (m) => m.StudioModule
              ),
          },
          {
            path: 'permissions',
            loadChildren: () =>
              import('@app/dashboard/coaching/single/permissions/permissions.module').then(
                (m) => m.PermissionsModule
              ),
          },
          {
            path: 'resources',
            loadChildren: () =>
              import('@app/dashboard/coaching/single/resources/resources.module').then(
                (m) => m.ResourcesModule
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
export class SingleRoutingModule { }
