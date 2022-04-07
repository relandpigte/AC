import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverviewRoutingModule } from './overview-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';

import { OverviewComponent } from './overview.component';
import { RevenueGraphComponent } from './_components/revenue-graph/revenue-graph.component';
import { TrafficGraphComponent } from './_components/traffic-graph/traffic-graph.component';
import { ConversionGraphComponent } from './_components/conversion-graph/conversion-graph.component';
import { EngagementGraphComponent } from './_components/engagement-graph/engagement-graph.component';

@NgModule({
  declarations: [
    OverviewComponent,
    RevenueGraphComponent,
    TrafficGraphComponent,
    ConversionGraphComponent,
    EngagementGraphComponent,
  ],
  imports: [
    CommonModule,
    OverviewRoutingModule,
    SharedModule,
    AppSharedModule,
  ],
})
export class OverviewModule { }
