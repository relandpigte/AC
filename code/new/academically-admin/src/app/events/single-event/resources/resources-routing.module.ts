import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ResourcesComponent } from './resources.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ResourcesComponent,
      },
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class ResourcesRoutingModule { }
