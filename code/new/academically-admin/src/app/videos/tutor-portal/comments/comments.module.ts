import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentsRoutingModule } from './comments-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';

import { CommentsComponent } from './comments.component';
import { VideoSeriesComponent } from './_components/video-series/video-series.component';
import { SingleVideoComponent } from './_components/single-video/single-video.component';
import { TutorPortalModule } from '../tutor-portal.module';

@NgModule({
  declarations: [
    CommentsComponent,
    VideoSeriesComponent,
    SingleVideoComponent,
  ],
  imports: [
    CommonModule,
    CommentsRoutingModule,
    SharedModule,
    AppSharedModule,
    TutorPortalModule,
  ],
})
export class CommentsModule { }
