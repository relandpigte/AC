import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoRoutingModule } from './video-routing.module';

import { VideoComponent } from './video.component';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';
import { DetailsComponent } from './components/details/details.component';

@NgModule({
  declarations: [
    VideoComponent,
    DetailsComponent,
  ],
  imports: [
    CommonModule,
    VideoRoutingModule,
    SharedModule,
    AppSharedModule,
  ],
  exports: [
    VideoComponent
  ]
})
export class VideoModule { }
