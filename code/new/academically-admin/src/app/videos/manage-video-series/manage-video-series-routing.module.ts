import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ManageVideoSeriesComponent } from './manage-video-series.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ManageVideoSeriesComponent,
        children: [
          {
            path: 'videos',
            loadChildren: () =>
              import('@app/videos/manage-video-series/videos/videos.module').then(
                (m) => m.VideosModule
              ),
          },
          { path: '', redirectTo: 'videos' },
        ]
      },
      {
        path: ':id',
        loadChildren: () =>
          import('@app/videos/manage-video/manage-video.module').then(
            (m) => m.ManageVideoModule
          ),
      },
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class ManageVideoSeriesRoutingModule { }
