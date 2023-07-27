import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DiscussionRoutingModule } from './discussion-routing.module';
import { CoachingDiscussionComponent } from './discussion.component';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';
import { IntroductionModule } from '@app/profile/introduction/introduction.module';
import { CoachBadgeComponent } from './_components/coach-badge/coach-badge.component';
import { SessionBadgeComponent } from './_components/session-badge/session-badge.component';

@NgModule({
  declarations: [
    CoachingDiscussionComponent,
    CoachBadgeComponent,
    SessionBadgeComponent
  ],
  exports: [
    CoachingDiscussionComponent,
    CoachBadgeComponent,
    SessionBadgeComponent
  ],
  imports: [
    CommonModule,
    DiscussionRoutingModule,
    SharedModule,
    AppSharedModule,
    IntroductionModule,
  ]
})
export class CoachingDiscussionModule { }
