import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CoachingDiscussionComponent } from '@app/coaching/discussion/discussion.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: CoachingDiscussionComponent,
      }
    ]),
  ],
  exports: [RouterModule]
})
export class DiscussionRoutingModule { }
