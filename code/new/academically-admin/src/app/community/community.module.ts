import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppSharedModule } from '@app/_shared/app-shared.module';
import { SharedModule } from '@shared/shared.module';
import { CommunityRoutingModule } from './community-routing.module';
import { CommunityComponent } from './community.component';
import { CommunityComposerComponent } from './_components/composer/composer.component';
import { FollowingTopicsComponent } from './_components/following/following-topics.component';
import { MoreTopicsComponent } from './_components/more-topics/more-topics.component';
import { CommunitySideCardComponent } from './_components/side-card/side-card.component';
import { AddTopicsComponent } from './_modals/add-topics/add-topics.component';

@NgModule({
  declarations: [
    AddTopicsComponent,
    CommunityComponent,
    CommunityComposerComponent,
    CommunitySideCardComponent,
    FollowingTopicsComponent,
    MoreTopicsComponent
  ],
  imports: [
    CommonModule,
    AppSharedModule,
    SharedModule,
    CommunityRoutingModule
  ]
})
export class CommunityModule { }
