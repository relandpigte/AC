import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ExploreTutorialsComponent } from './tutorials.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ExploreTutorialsComponent,
      }
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class TutorialsRoutingModule { }
