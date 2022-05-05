import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PortalComponent } from './portal.component';
import { PortalTempComponent } from './_components/portal-temp/portal-temp.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: PortalComponent,
      },
      {
        path: ':invitation-id',
        component: PortalTempComponent,
      },
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class PortalRoutingModule { }
