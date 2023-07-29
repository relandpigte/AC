import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CoachingReviewsComponent } from '@app/coaching/reviews/reviews.component';


const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild([
    {
      path: '',
      component: CoachingReviewsComponent,
    }
  ])],
  exports: [RouterModule]
})
export class ReviewsRoutingModule { }
