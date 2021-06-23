import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';

import { AppRouteGuard } from '@shared/auth/auth-route-guard';

import { WrapperComponent } from '@app/layout/wrapper/wrapper.component';
import { HeaderComponent } from './_components/header/header.component';
import { ProjectsComponent } from './projects.component';
import { ProjectResolver } from './_resolvers/project.resolver';
import { ProjectDetailsHeaderComponent } from './_components/project-details-header/project-details-header.component';
@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: WrapperComponent,
        data: { permission: 'Pages.Projects' },
        canActivate: [AppRouteGuard],
        canActivateChild: [AppRouteGuard],
        // resolve: { user: ProjectsResolver },
        children: [
          {
            path: '',
            component: HeaderComponent,
            outlet: 'header',
          },
          {
            path: '',
            component: ProjectsComponent,
            children: [
              {
                path: 'browse',
                loadChildren: () =>
                  import('@app/projects/browse-projects/browse-projects.module').then(
                    (m) => m.BrowseProjectsModule,
                  ),
              },
              { path: '', redirectTo: 'browse' },
            ]
          },
        ],
      },
      {
        path: ':project-id',
        component: WrapperComponent,
        data: { permission: 'Pages.Projects' },
        canActivate: [AppRouteGuard],
        canActivateChild: [AppRouteGuard],
        resolve: { project: ProjectResolver },
        children: [
          {
            path: '',
            component: ProjectDetailsHeaderComponent,
            outlet: 'header',
          },
          {
            path: 'proposals',
            loadChildren: () =>
              import('@app/projects/project-proposals/project-proposals.module').then(
                (m) => m.ProjectProposalsModule,
              ),
          },
        ]
      }
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class ProjectsRoutingModule { }
