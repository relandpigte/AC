import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';
import { PagesComponent } from './pages.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: PagesComponent,
        children: [
          { path: '404', component: NotFoundComponent },
          { path: '403', component: UnauthorizedComponent },
          {
            path: 'invitations',
            loadChildren: () => import('./invitations/invitations.module')
              .then(m => m.InvitationsModule),
          },
        ]
      },
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class PagesRoutingModule { }
