import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentRoutingModule } from './content-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';
import { ContentBuilderModule } from '@app/content-builder/content-builder.module';

import { ContentComponent } from './content.component';

@NgModule({
  declarations: [
    ContentComponent,
  ],
  imports: [
    CommonModule,
    ContentRoutingModule,
    SharedModule,
    AppSharedModule,
    ContentBuilderModule,
  ],
  exports: [
    ContentComponent
  ]
})
export class ContentModule { }
