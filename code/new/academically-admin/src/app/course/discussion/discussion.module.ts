import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DiscussionRoutingModule } from './discussion-routing.module';
import { CourseDiscussionComponent } from './discussion.component';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';
import { IntroductionModule } from '@app/profile/introduction/introduction.module';

@NgModule({
  declarations: [
    CourseDiscussionComponent
  ],
  exports: [
    CourseDiscussionComponent
  ],
  imports: [
    CommonModule,
    DiscussionRoutingModule,
    SharedModule,
    AppSharedModule,
    IntroductionModule,
  ]
})
export class CourseDiscussionModule { }
