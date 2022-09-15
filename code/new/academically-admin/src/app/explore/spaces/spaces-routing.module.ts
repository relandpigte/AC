import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ExploreSpacesComponent } from './spaces.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ExploreSpacesComponent,
      }
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class SpacesRoutingModule { }
