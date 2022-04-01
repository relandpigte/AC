import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortalRoutingModule } from './portal-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';

import { PortalComponent } from './portal.component';
import { DeviceSettingsComponent } from './_components/device-settings/device-settings.component';
import { SidebarComponent } from './_components/sidebar/sidebar.component';
import { OverviewComponent } from './_components/overview/overview.component';
import { EventStartingComponent } from './_components/event-starting/event-starting.component';
import { AttendeesComponent } from './_components/attendees/attendees.component';
import { LiveComponent } from './_components/attendees/_components/live/live.component';
import { RegistrantsComponent } from './_components/attendees/_components/registrants/registrants.component';
import { SpeakRequestsComponent } from './_components/attendees/_components/speak-requests/speak-requests.component';
import { UpcomingComponent } from './_components/overview/upcoming/upcoming.component';
import { RelatedComponent } from './_components/overview/related/related.component';
import { SettingsComponent } from './_components/settings/settings.component';
import { AudienceComponent } from './_components/settings/_components/audience/audience.component';
import { GuestsComponent } from './_components/settings/_components/guests/guests.component';
import { CoHostsComponent } from './_components/settings/_components/co-hosts/co-hosts.component';

@NgModule({
  declarations: [
    PortalComponent,
    DeviceSettingsComponent,
    SidebarComponent,
    OverviewComponent,
    EventStartingComponent,
    AttendeesComponent,
    LiveComponent,
    RegistrantsComponent,
    SpeakRequestsComponent,
    UpcomingComponent,
    RelatedComponent,
    SettingsComponent,
    AudienceComponent,
    GuestsComponent,
    CoHostsComponent,
  ],
  imports: [
    CommonModule,
    PortalRoutingModule,
    SharedModule,
    AppSharedModule,
  ],
})
export class PortalModule { }
