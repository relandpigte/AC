import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailsRoutingModule } from './details-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';
import { DetailsComponent } from './details.component';
import { AvailabilitySettingComponent } from './_components/availability-setting/availability-setting.component';
import { CreateEditAvailabilityComponent } from './_components/create-edit-availability/create-edit-availability.component';

@NgModule({
  declarations: [
    DetailsComponent,
    AvailabilitySettingComponent,
    CreateEditAvailabilityComponent
  ],
  imports: [
    CommonModule,
    DetailsRoutingModule,
    SharedModule,
    AppSharedModule,
  ],
})
export class DetailsModule { }
