import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventSeriesRoutingModule } from './event-series-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';
import { EventSeriesComponent } from './event-series.component';

@NgModule({
  declarations: [
    EventSeriesComponent,
  ],
  imports: [
    CommonModule,
    EventSeriesRoutingModule,
    SharedModule,
    AppSharedModule,
  ],
})
export class EventSeriesModule { }
