import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppSharedModule } from '@app/_shared/app-shared.module';
import { SharedModule } from '@shared/shared.module';
import { CommunityModule } from '../community.module';
import { CommunityPostCardComponent } from '../_components/community-post/community-post.component';
import { FollowingRoutingModule } from './following-routing.module';

import { FollowingComponent } from './following.component';

@NgModule({
  declarations: [
    CommunityPostCardComponent,
    FollowingComponent
  ],
  imports: [
    CommonModule,
    FollowingRoutingModule,
    SharedModule,
    AppSharedModule,
    CommunityModule
  ],
  exports: [
    FollowingComponent,
    CommunityPostCardComponent
  ]
})
export class FollowingModule { }
