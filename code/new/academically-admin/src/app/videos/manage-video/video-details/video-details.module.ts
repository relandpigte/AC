import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoDetailsRoutingModule } from './video-details-routing.module';

import { VideoDetailsComponent } from './video-details.component';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';

@NgModule({
  declarations: [
    VideoDetailsComponent,
  ],
  imports: [
    CommonModule,
    VideoDetailsRoutingModule,
    SharedModule,
    AppSharedModule,
  ],
  exports: [
    VideoDetailsComponent,
  ]
})
export class VideoDetailsModule { }
