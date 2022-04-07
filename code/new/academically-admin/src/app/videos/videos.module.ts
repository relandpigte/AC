import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideosRoutingModule } from './videos-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';
import {TeachingModule} from './_components/teaching/teaching.module';
import {LearningModule} from './_components/learning/learning.module';
import { VideosComponent } from './videos.component';
import { ChooseVideoTemplateComponent } from './_components/choose-video-template/choose-video-template.component';
import { CreateVideoComponent } from './_components/create-video/create-video.component';

@NgModule({
  declarations: [
    VideosComponent,
    ChooseVideoTemplateComponent,
    CreateVideoComponent,
  ],
  imports: [
    CommonModule,
    VideosRoutingModule,
    SharedModule,
    AppSharedModule,
    TeachingModule,
    LearningModule
  ],
})
export class VideosModule { }
