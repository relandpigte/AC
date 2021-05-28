import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactNumberRoutingModule } from './contact-number-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';

import { ContactNumberComponent } from './contact-number.component';

@NgModule({
  declarations: [
    ContactNumberComponent,
  ],
  imports: [
    CommonModule,
    ContactNumberRoutingModule,
    SharedModule,
    AppSharedModule,
  ],
})
export class ContactNumberModule { }
