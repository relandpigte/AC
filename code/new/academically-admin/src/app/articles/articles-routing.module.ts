import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppRouteGuard } from '@shared/auth/auth-route-guard';

import { WrapperComponent } from '@app/layout/wrapper/wrapper.component';
import { ArticlesComponent } from './articles.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: WrapperComponent,
        data: { permission: 'Pages.Articles' },
        canActivate: [AppRouteGuard],
        canActivateChild: [AppRouteGuard],
        children: [
          {
            path: '',
            component: ArticlesComponent,
          },
          {
            path: ':id',
            loadChildren: () =>
              import('@app/articles/single-article/single-article.module').then(
                (m) => m.SingleArticleModule
              ),
          },
          {
            path: 'article-series',
            children: [
              {
                path: ':parent-id',
                loadChildren: () =>
                  import('@app/articles/article-series/article-series.module').then(
                    (m) => m.ArticleSeriesModule
                  ),
              }
            ]
          },
        ],
      },
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class ArticlesRoutingModule { }
