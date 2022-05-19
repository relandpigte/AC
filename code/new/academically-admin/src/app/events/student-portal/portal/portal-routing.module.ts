import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { PortalComponent } from './portal.component';
import { PortalTempComponent } from './_components/portal-temp/portal-temp.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      ...['', ':invitation-id'].map(path => (
        {
          path,
          component: PortalComponent,
        } as Route
      )),
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class PortalRoutingModule { }
