import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticlesRoutingModule } from './articles-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';
import { TeachingModule } from '@app/articles/_components/teaching/teaching.module';
import { ArticlesComponent } from './articles.component';
import { ChooseTemplateComponent } from './_components/choose-template/choose-template.component';
import { CreateArticleComponent } from './_components/create-article/create-article.component';
import { LearningModule } from './_components/learning/learning.module';
import { DashboardModule } from '@app/dashboard/dashboard.module';
import { PurchasedComponent } from './_components/purchased/purchased.component';
import { CreatedComponent } from './_components/created/created.component';
@NgModule({
  declarations: [
    ArticlesComponent,
    ChooseTemplateComponent,
    CreateArticleComponent,
    PurchasedComponent,
    CreatedComponent,
  ],
  imports: [
    CommonModule,
    ArticlesRoutingModule,
    SharedModule,
    AppSharedModule,
    TeachingModule,
    LearningModule,
    DashboardModule,
  ],
})
export class ArticlesModule { }
