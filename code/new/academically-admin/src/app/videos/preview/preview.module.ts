import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreviewRoutingModule } from './preview-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';

import { PreviewComponent } from './preview.component';

@NgModule({
  declarations: [
    PreviewComponent,
  ],
  imports: [
    CommonModule,
    PreviewRoutingModule,
    SharedModule,
    AppSharedModule,
  ],
})
export class PreviewModule { }
