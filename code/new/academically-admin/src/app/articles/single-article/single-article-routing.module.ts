import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SingleArticleComponent } from './single-article.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: SingleArticleComponent,
        children: [
          {
            path: 'content',
            loadChildren: () =>
              import('@app/articles/single-article/content/content.module').then(
                (m) => m.ContentModule
              ),
          },
          {
            path: 'details',
            loadChildren: () =>
              import('@app/articles/single-article/details/details.module').then(
                (m) => m.DetailsModule
              ),
          },
          {
            path: 'settings',
            loadChildren: () =>
              import('@app/articles/single-article/settings/settings.module').then(
                (m) => m.SettingsModule
              ),
          },
          { path: '', redirectTo: 'content' },
        ]
      }
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class SingleArticleRoutingModule { }
