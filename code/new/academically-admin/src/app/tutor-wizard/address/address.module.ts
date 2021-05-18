import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddressRoutingModule } from './address-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';

import { AddressComponent } from './address.component';

@NgModule({
  declarations: [
    AddressComponent,
  ],
  imports: [
    CommonModule,
    AddressRoutingModule,
    SharedModule,
    AppSharedModule,
  ],
})
export class AddressModule { }
