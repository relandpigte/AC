import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ExploreUsersComponent } from './users.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ExploreUsersComponent,
      }
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class UsersRoutingModule { }
