import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleSeriesRoutingModule } from './article-series-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';

import { ArticleSeriesComponent } from './article-series.component';

@NgModule({
  declarations: [
    ArticleSeriesComponent,
  ],
  imports: [
    CommonModule,
    ArticleSeriesRoutingModule,
    SharedModule,
    AppSharedModule,
  ],
})
export class ArticleSeriesModule { }
