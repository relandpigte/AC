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
          {
            path: 'details',
            loadChildren: () =>
              import('@app/articles/article-series/details/details.module').then(
                (m) => m.DetailsModule
              ),
          },
          {
            path: 'settings',
            loadChildren: () =>
              import('@app/articles/article-series/settings/settings.module').then(
                (m) => m.SettingsModule
              ),
          },
          {
            path: 'landing-page',
            loadChildren: () =>
              import('@app/articles/article-series/landing-page/landing-page.module').then(
                (m) => m.LandingPageModule
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
