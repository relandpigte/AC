import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageVideoRoutingModule } from './manage-video-routing.module';

import { ManageVideoComponent } from './manage-video.component';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';
import { VideoModule } from '@app/videos/manage-video/video/video.module';
import { VideoDetailsModule } from '@app/videos/manage-video/video-details/video-details.module';
import { VideoSettingsModule } from '@app/videos/manage-video/video-settings/video-settings.module';
import { DetailsModule } from '@app/dashboard/events/details/broadcast/single/details/details.module';

@NgModule({
  declarations: [
    ManageVideoComponent,
  ],
  imports: [
    CommonModule,
    ManageVideoRoutingModule,
    SharedModule,
    AppSharedModule,
    VideoModule,
    VideoDetailsModule,
    VideoSettingsModule,
    DetailsModule,
  ],
})
export class ManageVideoModule { }
