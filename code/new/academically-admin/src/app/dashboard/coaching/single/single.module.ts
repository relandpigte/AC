import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingleRoutingModule } from './single-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';
import { SingleComponent } from './single.component';
import { DetailsModule } from '@app/dashboard/coaching/single/details/details.module';
import { SettingsModule } from '@app/dashboard/coaching/single/settings/settings.module';
import { StudioModule } from '@app/dashboard/coaching/single/studio/studio.module';
import { ResourcesModule } from '@app/dashboard/coaching/single/resources/resources.module';
import { ActivitiesComponent } from '@app/dashboard/coaching/single/activities/activities.component';

@NgModule({
  declarations: [
    SingleComponent,
    ActivitiesComponent
    ],
  imports: [
    CommonModule,
    SingleRoutingModule,
    SharedModule,
    AppSharedModule,
    DetailsModule,
    SettingsModule,
    StudioModule,
    ResourcesModule
  ],
})
export class SingleModule { }
