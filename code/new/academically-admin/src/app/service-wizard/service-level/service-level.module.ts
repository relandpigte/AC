import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceLevelRoutingModule } from './service-level-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';

import { ServiceLevelComponent } from './service-level.component';

@NgModule({
  declarations: [
    ServiceLevelComponent,
  ],
  imports: [
    CommonModule,
    ServiceLevelRoutingModule,
    SharedModule,
    AppSharedModule,
  ],
})
export class ServiceLevelModule { }
