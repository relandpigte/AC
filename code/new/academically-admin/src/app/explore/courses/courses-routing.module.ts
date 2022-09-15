import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ExploreCoursesComponent } from './courses.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ExploreCoursesComponent,
      }
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class CoursesRoutingModule { }
