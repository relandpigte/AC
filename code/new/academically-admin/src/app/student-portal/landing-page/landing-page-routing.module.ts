import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LandingPageComponent } from './landing-page.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        children: [
          {
            path: '',
            component: LandingPageComponent,
          },
        ],
      }
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class LandingPageRoutingModule { }
