import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { VideoSettingsComponent } from './video-settings.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: VideoSettingsComponent,
      },
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class VideoSettingsRoutingModule { }
