import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppSharedModule } from '@app/_shared/app-shared.module';
import { SharedModule } from '@shared/shared.module';
import { ArticlesRoutingModule } from './articles-routing.module';

import { ExploreArticlesComponent } from './articles.component';

@NgModule({
  declarations: [
    ExploreArticlesComponent,
  ],
  imports: [
    CommonModule,
    ArticlesRoutingModule,
    SharedModule,
    AppSharedModule,
  ],
})
export class ExploreArticlesModule { }
