import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudioRoutingModule } from './studio-routing.module';
import {StudioComponent} from './studio.component';
import {AppSharedModule} from '../../../_shared/app-shared.module';
import { SharedModule } from '../../../../../src/shared/shared.module';
import { PermissionsModule } from '../permissions/permissions.module';
@NgModule({
  declarations: [StudioComponent],
  imports: [
    CommonModule,
    StudioRoutingModule, SharedModule,
    AppSharedModule,
    PermissionsModule
  ]
})
export class StudioModule { }
