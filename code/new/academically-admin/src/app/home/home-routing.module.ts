import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppRouteGuard } from '@shared/auth/auth-route-guard';

import { WrapperComponent } from '@app/layout/wrapper/wrapper.component';
import { HomeComponent } from './home.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: WrapperComponent,
        data: { permission: 'Pages.Home' },
        canActivate: [AppRouteGuard],
        canActivateChild: [AppRouteGuard],
        children: [
          {
            path: '',
            component: HomeComponent,
            children: [
              {
                path: 'home',
                loadChildren: () =>
                  import('@app/home/home/home.module').then(
                    (m) => m.HomeModule
                  ),
              },
              {
                path: 'courses',
                loadChildren: () =>
                  import('@app/home/courses/courses.module').then(
                    (m) => m.CoursesModule
                  ),
              },
              {
                path: 'videos',
                loadChildren: () =>
                  import('@app/home/videos/videos.module').then(
                    (m) => m.VideosModule
                  ),
              },
              {
                path: 'articles',
                loadChildren: () =>
                  import('@app/home/articles/articles.module').then(
                    (m) => m.ArticlesModule
                  ),
              },
              {
                path: 'projects',
                loadChildren: () =>
                  import('@app/home/projects/projects.module').then(
                    (m) => m.ProjectsModule
                  ),
              },
              {
                path: 'events',
                loadChildren: () =>
                  import('@app/home/events/events.module').then(
                    (m) => m.EventsModule
                  ),
              },
              { path: '', redirectTo: 'home' },
            ]
          },
        ],
      }
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class HomeRoutingModule { }
