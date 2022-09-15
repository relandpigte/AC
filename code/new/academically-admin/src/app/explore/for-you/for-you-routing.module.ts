import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ExploreForYouComponent } from './for-you.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ExploreForYouComponent,
      }
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class ForYouRoutingModule { }
