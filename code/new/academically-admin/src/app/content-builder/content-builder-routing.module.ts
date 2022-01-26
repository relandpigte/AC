import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ContentBuilderComponent } from './content-builder.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ContentBuilderComponent,
      }
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class ContentBuilderRoutingModule { }
