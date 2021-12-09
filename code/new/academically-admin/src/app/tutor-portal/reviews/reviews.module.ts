
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';

import { ReviewsComponent } from './reviews.component';
import { ReviewsRoutingModule } from './reviews-routing.module';
import { TutorPortalModule } from '../tutor-portal.module';
import { CourseRatingSummaryComponent } from './_components/course-rating-summary/course-rating-summary.component';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { NgxPaginationModule } from 'ngx-pagination';
import { IntroductionModule } from '@app/profile/introduction/introduction.module';

@NgModule({
  declarations: [
    ReviewsComponent,
    CourseRatingSummaryComponent
  ],
  imports: [
    CommonModule,
    ReviewsRoutingModule,
    SharedModule,
    AppSharedModule,
    TutorPortalModule,
    PopoverModule.forRoot(),
    NgxPaginationModule,
    IntroductionModule
  ],
})
export class ReviewsModule { }
