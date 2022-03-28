import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortalRoutingModule } from './portal-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';

import { PortalComponent } from './portal.component';
import { DeviceSettingsComponent } from './_components/device-settings/device-settings.component';

@NgModule({
  declarations: [
    PortalComponent,
    DeviceSettingsComponent,
  ],
  imports: [
    CommonModule,
    PortalRoutingModule,
    SharedModule,
    AppSharedModule,
  ],
})
export class PortalModule { }
