import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EventsDiscussionComponent } from '@app/events/discussion/discussion.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: EventsDiscussionComponent,
      }
    ]),
  ],
  exports: [RouterModule]
})
export class EventsDiscussionRoutingModule { }
