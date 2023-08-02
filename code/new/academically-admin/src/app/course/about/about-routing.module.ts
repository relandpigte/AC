import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CourseAboutComponent } from '@app/course/about/about.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: CourseAboutComponent,
      }
    ]),
  ],
  exports: [RouterModule]
})
export class AboutRoutingModule { }
