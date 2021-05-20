import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguagesRoutingModule } from './languages-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';

import { LanguagesComponent } from './languages.component';
import { SpokenLanguagesModule } from '@app/profile/spoken-languages/spoken-languages.module';

@NgModule({
  declarations: [
    LanguagesComponent
  ],
  imports: [
    CommonModule,
    LanguagesRoutingModule,
    SharedModule,
    AppSharedModule,
    SpokenLanguagesModule
  ]
})
export class LanguagesModule { }
