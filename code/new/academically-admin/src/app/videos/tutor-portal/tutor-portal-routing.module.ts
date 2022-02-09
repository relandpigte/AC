import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TutorPortalComponent } from './tutor-portal.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: TutorPortalComponent,
        children: [
          {
            path: 'overview',
            loadChildren: () =>
              import('@app/videos/tutor-portal/overview/overview.module').then(
                (m) => m.OverviewModule,
              ),
          },
          {
            path: 'videos',
            loadChildren: () =>
              import('@app/videos/tutor-portal/videos/videos.module').then(
                (m) => m.VideosModule,
              ),
          },
          {
            path: 'comments',
            loadChildren: () =>
              import('@app/videos/tutor-portal/comments/comments.module').then(
                (m) => m.CommentsModule,
              ),
          },
          { path: '', redirectTo: 'overview' },
        ],
      }
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class TutorPortalRoutingModule { }
