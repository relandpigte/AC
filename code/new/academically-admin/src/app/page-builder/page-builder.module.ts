import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageBuilderRoutingModule } from './page-builder-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';
import { ContentModule } from './_components/content/content.module';

import { TagInputModule } from 'ngx-chips';
import { NgxMaskModule } from 'ngx-mask';

import { PageBuilderComponent } from './page-builder.component';
import { SettingsComponent } from './_components/settings/settings.component';
import { DetailsComponent } from './_components/details/details.component';
import { ContentSelectorComponent } from './_components/content-selector/content-selector.component';

@NgModule({
  declarations: [
    PageBuilderComponent,
    SettingsComponent,
    DetailsComponent,
    ContentSelectorComponent,
  ],
  imports: [
    CommonModule,
    PageBuilderRoutingModule,
    SharedModule,
    AppSharedModule,
    TagInputModule,
    NgxMaskModule.forRoot(),
    ContentModule,
  ],
})
export class PageBuilderModule { }
