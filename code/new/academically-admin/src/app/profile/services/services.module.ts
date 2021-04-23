import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServicesRoutingModule } from './services-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';

import { ServicesComponent } from './services.component';
import { CreateEditServiceComponent } from './_components/create-edit-service/create-edit-service.component';

@NgModule({
  declarations: [
    ServicesComponent,
    CreateEditServiceComponent,
  ],
  imports: [
    CommonModule,
    ServicesRoutingModule,
    SharedModule,
    AppSharedModule,
  ],
})
export class ServicesModule { }
