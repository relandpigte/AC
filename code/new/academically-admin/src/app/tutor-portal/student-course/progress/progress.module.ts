import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressRoutingModule } from './progress-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';

import { ProgressComponent } from './progress.component';

@NgModule({
  declarations: [
    ProgressComponent,
  ],
  imports: [
    CommonModule,
    ProgressRoutingModule,
    SharedModule,
    AppSharedModule,
  ],
})
export class ProgressModule { }
