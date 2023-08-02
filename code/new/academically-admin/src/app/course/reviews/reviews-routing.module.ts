import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CourseReviewsComponent } from '@app/course/reviews/reviews.component';


const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild([
    {
      path: '',
      component: CourseReviewsComponent,
    }
  ])],
  exports: [RouterModule]
})
export class ReviewsRoutingModule { }
