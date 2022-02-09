import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsRoutingModule } from './settings-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';
import * as SingleArticle from '@app/articles/single-article/settings/settings.module';

import { SettingsComponent } from './settings.component';

@NgModule({
  declarations: [
    SettingsComponent,
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    SharedModule,
    AppSharedModule,
    SingleArticle.SettingsModule,
  ],
})
export class SettingsModule { }
