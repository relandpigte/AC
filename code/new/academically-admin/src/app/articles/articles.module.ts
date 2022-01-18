import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticlesRoutingModule } from './articles-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';

import { ArticlesComponent } from './articles.component';
import { ChooseTemplateComponent } from './_components/choose-template/choose-template.component';
import { TeachingComponent } from './_components/teaching/teaching.component';
import { LearningComponent } from './_components/learning/learning.component';
import { CreateArticleComponent } from './_components/create-article/create-article.component';

@NgModule({
  declarations: [
    ArticlesComponent,
    ChooseTemplateComponent,
    TeachingComponent,
    LearningComponent,
    CreateArticleComponent,
  ],
  imports: [
    CommonModule,
    ArticlesRoutingModule,
    SharedModule,
    AppSharedModule,
  ],
})
export class ArticlesModule { }
