import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';
import { PermissionsRoutingModule } from './permissions-routing.module';
import {PermissionsComponent} from './permissions.component';
import { AudienceComponent } from './audience/audience.component';
import { CoHostComponent } from './co-host/co-host.component';
import { GuestsComponent } from './guests/guests.component';

@NgModule({
  declarations: [PermissionsComponent, AudienceComponent, CoHostComponent, GuestsComponent],
  imports: [
    CommonModule,
    SharedModule,
    AppSharedModule,
    PermissionsRoutingModule
  ],
  exports : [
    AudienceComponent, CoHostComponent, GuestsComponent
  ]
})
export class PermissionsModule { }
