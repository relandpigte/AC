import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AboutRoutingModule } from './about-routing.module';
import { CoachingAboutComponent } from './about.component';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';
import { AboutSessionComponent } from './_components/about-session/about-session.component';
import { AboutLearnComponent } from './_components/about-learn/about-learn.component';
import { AboutCoachComponent } from './_components/about-coach/about-coach.component';
import { AboutRelatedCoachingComponent } from './_components/about-related-coaching/about-related-coaching.component';
import { IntroductionModule } from '@app/profile/introduction/introduction.module';
import { LeaveReviewBadgeComponent } from './_components/leave-review-badge/leave-review-badge.component';
import { ReviewBadgeComponent } from '@app/coaching/about/_components/review-badge/review-badge.component';

@NgModule({
  declarations: [
    CoachingAboutComponent,
    AboutSessionComponent,
    AboutLearnComponent,
    AboutCoachComponent,
    AboutRelatedCoachingComponent,
    LeaveReviewBadgeComponent,
    ReviewBadgeComponent
  ],
  exports: [
    AboutCoachComponent,
    AboutRelatedCoachingComponent,
    LeaveReviewBadgeComponent,
    ReviewBadgeComponent
  ],
  imports: [
    CommonModule,
    AboutRoutingModule,
    SharedModule,
    AppSharedModule,
    IntroductionModule,
  ]
})
export class CoachingAboutModule { }
