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
import { OffersComponent } from '@app/dashboard/coaching/single/offers/offers.component';
import { PresentationComponent } from '@app/dashboard/coaching/single/presentation/presentation.component';
import { PresentationDetailsComponent } from '@app/dashboard/coaching/single/presentation/components/details/details.component';
import { HandoutsComponent } from '@app/dashboard/coaching/single/handouts/handouts.component';
import { HandoutsDetailsComponent } from '@app/dashboard/coaching/single/handouts/components/details/details.component';

@NgModule({
  declarations: [
    SingleComponent,
    ActivitiesComponent,
    OffersComponent,
    PresentationComponent,
    PresentationDetailsComponent,
    HandoutsComponent,
    HandoutsDetailsComponent
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
