import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsageRoutingModule } from './usage-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';

import { UsageComponent } from './usage.component';
import { UsageOverviewComponent } from './usage-overview/usage-overview.component';
import { UsageOverviewGraphComponent } from './usage-overview-graph/usage-overview-graph.component';

@NgModule({
  declarations: [
    UsageComponent,
    UsageOverviewComponent,
    UsageOverviewGraphComponent
  ],
  imports: [
    CommonModule,
    UsageRoutingModule,
    SharedModule,
    AppSharedModule,
  ],
})
export class UsageModule { }
