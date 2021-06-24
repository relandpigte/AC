import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HiredRoutingModule } from './hired-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';

import { HiredComponent } from './hired.component';

@NgModule({
  declarations: [
    HiredComponent,
  ],
  imports: [
    CommonModule,
    HiredRoutingModule,
    SharedModule,
    AppSharedModule,
  ],
})
export class HiredModule { }
