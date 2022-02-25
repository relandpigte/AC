import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideosRoutingModule } from './videos-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';

import { VideosComponent } from './videos.component';
import { TeachingComponent } from './_components/teaching/teaching.component';
import { LearningComponent } from './_components/learning/learning.component';
import { ChooseVideoTemplateComponent } from './_components/choose-video-template/choose-video-template.component';
import { CreateVideoComponent } from './_components/create-video/create-video.component';
import { SavedComponent } from './_components/learning/saved/saved.component';
import { PurchasedComponent } from './_components/learning/purchased/purchased.component';

@NgModule({
  declarations: [
    VideosComponent,
    TeachingComponent,
    LearningComponent,
    ChooseVideoTemplateComponent,
    CreateVideoComponent,
    SavedComponent,
    PurchasedComponent,
  ],
  imports: [
    CommonModule,
    VideosRoutingModule,
    SharedModule,
    AppSharedModule,
  ],
})
export class VideosModule { }
