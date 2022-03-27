import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PortalComponent } from './portal.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: PortalComponent,
      },
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class PortalRoutingModule { }
