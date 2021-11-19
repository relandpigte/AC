import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverviewRoutingModule } from './overview-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';

import { OverviewComponent } from './overview.component';

@NgModule({
  declarations: [
    OverviewComponent,
  ],
  imports: [
    CommonModule,
    OverviewRoutingModule,
    SharedModule,
    AppSharedModule,
  ],
})
export class OverviewModule { }
