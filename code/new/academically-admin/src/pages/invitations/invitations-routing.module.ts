import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { InvitationsComponent } from './invitations.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: InvitationsComponent,
        children: [
          {
            path: 'event',
            loadChildren: () => import('./event/event.module')
              .then(m => m.EventModule),
          },
        ],
      },
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class InvitationsRoutingModule { }
