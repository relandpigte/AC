import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TutorialsComponent } from './tutorials.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: TutorialsComponent,
      },
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class TutorialsRoutingModule { }
