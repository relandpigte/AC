import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PopularComponent } from './popular.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: PopularComponent,
      }
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class PopularRoutingModule { }
