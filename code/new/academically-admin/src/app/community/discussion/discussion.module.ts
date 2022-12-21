import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppSharedModule } from '@app/_shared/app-shared.module';
import { SharedModule } from '@shared/shared.module';

import { DiscussionRoutingModule } from './discussion-routing.module';
import { DiscussionComponent } from './discussion.component';

@NgModule({
  declarations: [
    DiscussionComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AppSharedModule,
    DiscussionRoutingModule
  ],
  exports: [
    DiscussionComponent
  ]
})
export class DiscussionModule { }
