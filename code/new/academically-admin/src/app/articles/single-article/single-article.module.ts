import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingleArticleRoutingModule } from './single-article-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';

import { SingleArticleComponent } from './single-article.component';

@NgModule({
  declarations: [
    SingleArticleComponent,
  ],
  imports: [
    CommonModule,
    SingleArticleRoutingModule,
    SharedModule,
    AppSharedModule,
  ],
})
export class SingleArticleModule { }
