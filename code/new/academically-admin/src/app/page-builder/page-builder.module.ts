import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageBuilderRoutingModule } from './page-builder-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';

import { PageBuilderComponent } from './page-builder.component';
import { ContentComponent } from './_components/content/content.component';

@NgModule({
  declarations: [
    PageBuilderComponent,
    ContentComponent,
  ],
  imports: [
    CommonModule,
    PageBuilderRoutingModule,
    SharedModule,
    AppSharedModule,
  ],
})
export class PageBuilderModule { }
