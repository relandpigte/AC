import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MessagesComponent } from './messages.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        children: [
          {
            path: '',
            component: MessagesComponent,
          },
        ],
      }
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class MessagesRoutingModule { }
