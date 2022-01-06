import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageVideoSeriesRoutingModule } from './manage-video-series-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';

import { ManageVideoSeriesComponent } from './manage-video-series.component';

@NgModule({
  declarations: [
    ManageVideoSeriesComponent,
  ],
  imports: [
    CommonModule,
    ManageVideoSeriesRoutingModule,
    SharedModule,
    AppSharedModule,
  ],
})
export class ManageVideoSeriesModule { }
