import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppSharedModule } from '@app/_shared/app-shared.module';
import { SharedModule } from '@shared/shared.module';
import { CommunityRoutingModule } from './community-routing.module';
import { CommunityComponent } from './community.component';
import { AttachmentPreviewComponent } from './_components/attachment-preview/attachment-preview.component';
import { CommunityComposerComponent } from './_components/composer/composer.component';
import { FollowingTopicsComponent } from './_components/following/following-topics.component';
import { MoreTopicsComponent } from './_components/more-topics/more-topics.component';
import { CommunitySideCardComponent } from './_components/side-card/side-card.component';
import { CommunityPostComponent } from './_components/post/post.component';
import { ServicePickerComponent } from './_components/service-picker/service-picker.component';
import { AddTopicsComponent } from './_modals/add-topics/add-topics.component';
import { AddPostComponent } from './_modals/add-post/add-post.component';

@NgModule({
  declarations: [
    AddTopicsComponent,
    AddPostComponent,
    AttachmentPreviewComponent,
    CommunityComponent,
    CommunityComposerComponent,
    CommunitySideCardComponent,
    CommunityPostComponent,
    FollowingTopicsComponent,
    MoreTopicsComponent,
    ServicePickerComponent
  ],
  imports: [
    CommonModule,
    AppSharedModule,
    SharedModule,
    CommunityRoutingModule
  ]
})
export class CommunityModule { }
