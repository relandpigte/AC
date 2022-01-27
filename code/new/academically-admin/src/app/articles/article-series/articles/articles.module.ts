import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticlesRoutingModule } from './articles-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';

import { ArticlesComponent } from './articles.component';

@NgModule({
  declarations: [
    ArticlesComponent,
  ],
  imports: [
    CommonModule,
    ArticlesRoutingModule,
    SharedModule,
    AppSharedModule,
  ],
})
export class ArticlesModule { }
