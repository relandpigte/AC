import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoRoutingModule } from './video-routing.module';

import { VideoComponent } from './video.component';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';

@NgModule({
  declarations: [
    VideoComponent,
  ],
  imports: [
    CommonModule,
    VideoRoutingModule,
    SharedModule,
    AppSharedModule,
  ],
})
export class VideoModule { }
