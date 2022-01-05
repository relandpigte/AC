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
          { path: '', redirectTo: 'video' },
          {
            path: 'video',
            loadChildren: () =>
              import('@app/videos/manage-video/video/video.module').then(
                (m) => m.VideoModule
              ),
          },
        ]
      }
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class ManageVideoRoutingModule { }
