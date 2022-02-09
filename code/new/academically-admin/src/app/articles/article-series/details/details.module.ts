import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailsRoutingModule } from './details-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';
import * as SingleArticle from '@app/articles/single-article/details/details.module';

import { DetailsComponent } from './details.component';

@NgModule({
  declarations: [
    DetailsComponent,
  ],
  imports: [
    CommonModule,
    DetailsRoutingModule,
    SharedModule,
    AppSharedModule,
    SingleArticle.DetailsModule,
  ],
})
export class DetailsModule { }
