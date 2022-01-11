import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailsRoutingModule } from './details-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';

import { DetailsComponent } from './details.component';
import { VideoDetailsModule } from '@app/videos/manage-video/video-details/video-details.module';

@NgModule({
  declarations: [
    DetailsComponent,
  ],
  imports: [
    CommonModule,
    DetailsRoutingModule,
    SharedModule,
    AppSharedModule,
    VideoDetailsModule,
  ],
})
export class DetailsModule { }
