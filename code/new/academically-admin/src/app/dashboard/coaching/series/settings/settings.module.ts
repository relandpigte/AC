import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsRoutingModule } from './settings-routing.module';
import * as Single from '@app/dashboard/coaching/single/settings/settings.module';

import { SettingsComponent } from './settings.component';

@NgModule({
  declarations: [
    SettingsComponent,
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    Single.SettingsModule,
  ],
})
export class SettingsModule { }
