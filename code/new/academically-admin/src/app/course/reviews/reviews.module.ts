import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReviewsRoutingModule } from './reviews-routing.module';
import { CourseReviewsComponent } from './reviews.component';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';

@NgModule({
  declarations: [
    CourseReviewsComponent
  ],
  imports: [
    CommonModule,
    ReviewsRoutingModule,
    SharedModule,
    AppSharedModule
  ]
})
export class CourseReviewsModule { }
