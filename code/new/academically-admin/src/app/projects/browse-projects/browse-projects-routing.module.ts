import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppRouteGuard } from '@shared/auth/auth-route-guard';

import { BrowseProjectsComponent } from './browse-projects.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: BrowseProjectsComponent,
        data: { permission: 'Pages.Projects.Browse' },
        canActivate: [AppRouteGuard],
        canActivateChild: [AppRouteGuard],
      },
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class BrowseProjectsRoutingModule { }
