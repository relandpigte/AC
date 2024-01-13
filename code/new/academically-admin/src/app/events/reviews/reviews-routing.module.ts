import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EventReviewsComponent } from '@app/events/reviews/reviews.component';


const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild([
    {
      path: '',
      component: EventReviewsComponent,
    }
  ])],
  exports: [RouterModule]
})
export class ReviewsRoutingModule { }
