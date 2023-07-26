import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CoachingAboutComponent } from '@app/coaching/about/about.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: CoachingAboutComponent,
      }
    ]),
  ],
  exports: [RouterModule]
})
export class AboutRoutingModule { }
