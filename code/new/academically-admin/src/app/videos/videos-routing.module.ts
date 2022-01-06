import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppRouteGuard } from '@shared/auth/auth-route-guard';

import { WrapperComponent } from '@app/layout/wrapper/wrapper.component';
import { VideosComponent } from './videos.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: WrapperComponent,
        data: { permission: 'Pages.Videos' },
        canActivate: [AppRouteGuard],
        canActivateChild: [AppRouteGuard],
        children: [
          {
            path: '',
            component: VideosComponent,
          },
          {
            path: ':id',
            loadChildren: () =>
              import('@app/videos/manage-video/manage-video.module').then(
                (m) => m.ManageVideoModule
              ),
          },
          {
            path: 'video-series',
            children: [
              {
                path: ':parent-id',
                loadChildren: () =>
                  import('@app/videos/manage-video-series/manage-video-series.module').then(
                    (m) => m.ManageVideoSeriesModule
                  ),
              }
            ]
          },
        ],
      },
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class VideosRoutingModule { }
