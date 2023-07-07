import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { EditHistoryComponent } from './edit-history.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: EditHistoryComponent,
      }
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class EditHistoryRoutingModule { }
