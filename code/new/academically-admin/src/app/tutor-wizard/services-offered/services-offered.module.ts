import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServicesOfferedRoutingModule } from './services-offered-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';

import { ServicesOfferedComponent } from './services-offered.component';
import { ServicesModule } from '@app/profile/services/services.module';

@NgModule({
  declarations: [
    ServicesOfferedComponent,
  ],
  imports: [
    CommonModule,
    ServicesOfferedRoutingModule,
    SharedModule,
    AppSharedModule,
    ServicesModule
  ],
})
export class ServicesOfferedModule { }
