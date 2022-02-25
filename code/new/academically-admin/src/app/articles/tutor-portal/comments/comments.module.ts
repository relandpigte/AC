import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentsRoutingModule } from './comments-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';

import { CommentsComponent } from './comments.component';
import { CommentsModule as SharedCommentsModule } from '@app/_shared/modules/comments/comments.module';
import { SingleArticleComponent } from './_components/single-article/single-article.component';
import { ArticleSeriesComponent } from './_components/article-series/article-series.component';

@NgModule({
  declarations: [
    CommentsComponent,
    SingleArticleComponent,
    ArticleSeriesComponent,
  ],
  imports: [
    CommonModule,
    CommentsRoutingModule,
    SharedModule,
    AppSharedModule,
    SharedCommentsModule,
  ],
})
export class CommentsModule { }
