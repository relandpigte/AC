import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingleArticleRoutingModule } from './single-article-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';

import { SingleArticleComponent } from './single-article.component';
import { ContentModule } from '@app/articles/single-article/content/content.module';
import { DetailsModule } from '@app/articles/single-article/details/details.module';
import { SettingsModule } from '@app/articles/single-article/settings/settings.module';
import { OffersComponent } from './offers/offers.component';
import { ActivitiesComponent } from '@app/articles/single-article/activities/activities.component';


@NgModule({
  declarations: [
    SingleArticleComponent,
    OffersComponent,
    ActivitiesComponent
  ],
  imports: [
    CommonModule,
    SingleArticleRoutingModule,
    SharedModule,
    AppSharedModule,
    ContentModule,
    DetailsModule,
    SettingsModule,
  ],
  exports: [
    OffersComponent
  ]
})
export class SingleArticleModule { }
