import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ManageVideoComponent } from './manage-video.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ManageVideoComponent,
        children: [
          {
            path: 'video',
            loadChildren: () =>
              import('@app/videos/manage-video/video/video.module').then(
                (m) => m.VideoModule
              ),
          },
          {
            path: 'details',
            loadChildren: () =>
              import('@app/videos/manage-video/video-details/video-details.module').then(
                (m) => m.VideoDetailsModule),
          },
          {
            path: 'settings',
            loadChildren: () =>
              import('@app/videos/manage-video/video-settings/video-settings.module').then(
                (m) => m.VideoSettingsModule
              ),
          },
          { path: '', redirectTo: 'video' },
        ]
      }
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class ManageVideoRoutingModule { }
