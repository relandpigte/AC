import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppSharedModule } from '@app/_shared/app-shared.module';
import { SharedModule } from '@shared/shared.module';

import { AllComponent } from './all.component';
import { AllRoutingModule } from './all-routing.module';

@NgModule({
  declarations: [
    AllComponent
  ],
  imports: [
    CommonModule,
    AllRoutingModule,
    SharedModule,
    AppSharedModule,
  ],
  exports: [
    AllComponent
  ]
})
export class AllModule { }
