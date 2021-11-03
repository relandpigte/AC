import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { AppRouteGuard } from '@shared/auth/auth-route-guard';

import { BrowseProjectsComponent } from './browse-projects.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      ...['', ':id'].map(path => (
        {
          path,
          component: BrowseProjectsComponent,
          data: { permission: 'Pages.Projects.Browse' },
          canActivate: [AppRouteGuard],
          canActivateChild: [AppRouteGuard],
        } as Route
      )),
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class BrowseProjectsRoutingModule { }
