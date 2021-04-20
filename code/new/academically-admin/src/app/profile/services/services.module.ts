import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServicesRoutingModule } from './services-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';

import { ServicesComponent } from './services.component';

@NgModule({
  declarations: [
    ServicesComponent,
  ],
  imports: [
    CommonModule,
    ServicesRoutingModule,
    SharedModule,
    AppSharedModule,
  ],
})
export class ServicesModule { }
