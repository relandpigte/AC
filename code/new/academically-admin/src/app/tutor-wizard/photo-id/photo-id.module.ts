import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhotoIdRoutingModule } from './photo-id-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';

import { PhotoIdComponent } from './photo-id.component';

@NgModule({
  declarations: [PhotoIdComponent],
  imports: [
    CommonModule,
    PhotoIdRoutingModule,
    SharedModule,
    AppSharedModule,
  ]
})
export class PhotoIdModule { }
