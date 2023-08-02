import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EventsAboutComponent } from '@app/events/about/about.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: EventsAboutComponent,
      }
    ]),
  ],
  exports: [RouterModule]
})
export class AboutRoutingModule { }
