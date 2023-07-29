import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReviewsRoutingModule } from './reviews-routing.module';
import { CoachingReviewsComponent } from './reviews.component';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';
import { ReviewStatsComponent } from './_components/review-stats/review-stats.component';
import { IntroductionModule } from '@app/profile/introduction/introduction.module';


@NgModule({
  declarations: [
    CoachingReviewsComponent,
    ReviewStatsComponent
  ],
  exports: [
    ReviewStatsComponent
  ],
  imports: [
    CommonModule,
    ReviewsRoutingModule,
    SharedModule,
    AppSharedModule,
    IntroductionModule
  ]
})
export class CoachingReviewsModule { }
