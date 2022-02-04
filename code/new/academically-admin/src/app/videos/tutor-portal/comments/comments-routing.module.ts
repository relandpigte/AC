import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CommentsComponent } from './comments.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: CommentsComponent,
      }
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class CommentsRoutingModule { }
