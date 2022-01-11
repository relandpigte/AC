import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { VideoDetailsComponent } from './video-details.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: VideoDetailsComponent,
      },
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class VideoDetailsRoutingModule { }
