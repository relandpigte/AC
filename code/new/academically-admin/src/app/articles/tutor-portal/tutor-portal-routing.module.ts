import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TutorPortalComponent } from './tutor-portal.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: TutorPortalComponent,
        children: [
          {
            path: 'overview',
            loadChildren: () =>
              import('@app/articles/tutor-portal/overview/overview.module').then(
                (m) => m.OverviewModule,
              ),
          },
          {
            path: 'articles',
            loadChildren: () =>
              import('@app/articles/tutor-portal/articles/articles.module').then(
                (m) => m.ArticlesModule,
              ),
          },
          {
            path: 'comments',
            loadChildren: () =>
              import('@app/articles/tutor-portal/comments/comments.module').then(
                (m) => m.CommentsModule,
              ),
          },
          { path: '', redirectTo: 'overview' },
        ],
      }
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class TutorPortalRoutingModule { }
