import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';

import { AppRouteGuard } from '@shared/auth/auth-route-guard';

import { WrapperComponent } from '@app/layout/wrapper/wrapper.component';
import { HeaderComponent } from './_components/header/header.component';
import { ProjectsComponent } from './projects.component';
import { OfferComponent } from './offer/offer.component';
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
        path: '',
        component: WrapperComponent,
        data: { permission: 'Pages.Projects' },
        canActivate: [AppRouteGuard],
        canActivateChild: [AppRouteGuard],
        // resolve: { user: ProjectsResolver },
        children: [
          {
            path: ':project-id/offer',
            loadChildren: () =>
              import('@app/projects/offer/offer.module').then(
                (m) => m.OfferModule,
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
