import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ArticleSeriesComponent } from './article-series.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ArticleSeriesComponent,
        children: [
          {
            path: 'articles',
            loadChildren: () =>
              import('@app/articles/article-series/articles/articles.module').then(
                (m) => m.ArticlesModule
              ),
          },
          { path: '', redirectTo: 'articles' },
        ]
      },
      {
        path: ':id',
        loadChildren: () =>
          import('@app/articles/single-article/single-article.module').then(
            (m) => m.SingleArticleModule
          ),
      },
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class ArticleSeriesRoutingModule { }
