import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CourseDiscussionComponent } from '@app/course/discussion/discussion.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: CourseDiscussionComponent,
      }
    ]),
  ],
  exports: [RouterModule]
})
export class DiscussionRoutingModule { }
