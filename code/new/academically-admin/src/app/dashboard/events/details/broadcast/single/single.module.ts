import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingleRoutingModule } from './single-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';
import { SingleComponent } from './single.component';
import { DetailsModule } from '@app/dashboard/events/details/broadcast/single/details/details.module';
import { SettingsModule } from '@app/dashboard/events/details/broadcast/single/settings/settings.module';
import { ResourcesModule } from '@app/dashboard/events/details/broadcast/single/resources/resources.module';
import { StudioModule } from '@app/dashboard/events/details/broadcast/single/studio/studio.module';
import { OffersComponent } from '@app/dashboard/events/details/broadcast/single/offers/offers.component';
import { ActivitiesComponent } from '@app/dashboard/events/details/broadcast/single/activities/activities.component';

@NgModule({
  declarations: [
    SingleComponent,
    OffersComponent,
    ActivitiesComponent
  ],
  imports: [
    CommonModule,
    SingleRoutingModule,
    SharedModule,
    AppSharedModule,
    DetailsModule,
    SettingsModule,
    DetailsModule,
    ResourcesModule,
    StudioModule
  ],
})
export class SingleModule { }
