import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ExploreArticlesComponent } from './articles.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ExploreArticlesComponent,
      }
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class ArticlesRoutingModule { }
