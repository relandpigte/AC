import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateProjectRoutingModule } from './create-project-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';

import { CreateProjectComponent } from './create-project.component';
import { AvailabilitySettingComponent } from './_components/availability-setting/availability-setting.component';
import { CreateEditAvailabilityComponent } from './_components/create-edit-availability/create-edit-availability.component';

@NgModule({
  declarations: [
    CreateProjectComponent,
    AvailabilitySettingComponent,
    CreateEditAvailabilityComponent,
  ],
  imports: [
    CommonModule,
    CreateProjectRoutingModule,
    SharedModule,
    AppSharedModule,
  ],
})
export class CreateProjectModule { }
