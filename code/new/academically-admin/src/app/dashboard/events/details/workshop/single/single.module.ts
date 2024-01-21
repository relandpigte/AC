import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingleRoutingModule } from './single-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';
import { SingleComponent } from './single.component';
import { DetailsModule } from '@app/dashboard/events/details/workshop/single/details/details.module';
import { PermissionsModule } from '@app/dashboard/events/details/workshop/single/permissions/permissions.module';
import { ResourcesModule } from '@app/dashboard/events/details/workshop/single/resources/resources.module';
import { StudioModule } from '@app/dashboard/events/details/workshop/single/studio/studio.module';
import { SettingsModule } from '@app/dashboard/events/details/workshop/single/settings/settings.module';

@NgModule({
  declarations: [
    SingleComponent
    ],
  imports: [
    CommonModule,
    SingleRoutingModule,
    SharedModule,
    AppSharedModule,
    DetailsModule,
    PermissionsModule,
    ResourcesModule,
    StudioModule,
    SettingsModule,
  ],
})
export class SingleModule { }
