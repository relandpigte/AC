import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeriesRoutingModule } from './series-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';
import { SeriesComponent } from './series.component';

@NgModule({
  declarations: [
    SeriesComponent,
  ],
  imports: [
    CommonModule,
    SeriesRoutingModule,
    SharedModule,
    AppSharedModule,
  ],
})
export class SeriesModule { }
