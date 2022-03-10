import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudioRoutingModule } from './studio-routing.module';
import { PermissionsModule } from '../permissions/permissions.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';
import { SharedModule } from '@shared/shared.module';
import { StudioComponent } from './studio.component';

@NgModule({
  declarations: [
    StudioComponent,
  ],
  imports: [
    CommonModule,
    StudioRoutingModule,
    SharedModule,
    AppSharedModule,
    PermissionsModule,
  ]
})
export class StudioModule { }
