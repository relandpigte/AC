import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MessagesComponent } from './messages.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: MessagesComponent,
      }
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class MessagesRoutingModule { }
