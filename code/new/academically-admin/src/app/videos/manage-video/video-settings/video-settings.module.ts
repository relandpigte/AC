import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoSettingsRoutingModule } from './video-settings-routing.module';

import { VideoSettingsComponent } from './video-settings.component';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';

@NgModule({
  declarations: [
    VideoSettingsComponent,
  ],
  imports: [
    CommonModule,
    VideoSettingsRoutingModule,
    SharedModule,
    AppSharedModule,
  ],
  exports: [
    VideoSettingsComponent,
  ]
})
export class VideoSettingsModule { }
