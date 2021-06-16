import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceSelectionRoutingModule } from './service-selection-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';

import { ServiceSelectionComponent } from './service-selection.component';

@NgModule({
  declarations: [
    ServiceSelectionComponent,
  ],
  imports: [
    CommonModule,
    ServiceSelectionRoutingModule,
    SharedModule,
    AppSharedModule,
  ],
})
export class ServiceSelectionModule { }
