import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortalRoutingModule } from './portal-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';
import { CanvasWhiteboardModule } from 'ng2-canvas-whiteboard';
import { QuestionsModule as SharedQuestionsModule } from '@app/_shared/modules/questions/questions.module';

import { PortalComponent } from './portal.component';
import { DeviceSettingsComponent } from './_components/device-settings/device-settings.component';
import { SidebarComponent } from './_components/sidebar/sidebar.component';
import { OverviewComponent } from './_components/overview/overview.component';
import { EventStartingComponent } from './_components/event-starting/event-starting.component';
import { AttendeesComponent } from './_components/attendees/attendees.component';
import { LiveComponent } from './_components/attendees/_components/live/live.component';
import { RegistrantsComponent } from './_components/attendees/_components/registrants/registrants.component';
import { SpeakRequestsComponent } from './_components/attendees/_components/speak-requests/speak-requests.component';
import { OffersComponent } from './_components/offers/offers.component';
import { OfferCardComponent } from './_components/offers/_components/offer-card/offer-card.component';
import { ClosedComponent } from './_components/offers/_components/closed/closed.component';
import { InfoBannerComponent } from './_components/offers/_components/info-banner/info-banner.component';
import { OpenComponent } from './_components/offers/_components/open/open.component';
import { CreateOfferComponent } from './_components/offers/_components/create-offer/create-offer.component';
import { QueueComponent } from './_components/offers/_components/queue/queue.component';
import { UpcomingComponent } from './_components/overview/upcoming/upcoming.component';
import { RelatedComponent } from './_components/overview/related/related.component';
import { SettingsComponent } from './_components/settings/settings.component';
import { AudienceComponent } from './_components/settings/_components/audience/audience.component';
import { GuestsComponent } from './_components/settings/_components/guests/guests.component';
import { CoHostsComponent } from './_components/settings/_components/co-hosts/co-hosts.component';
import { ShareVideosComponent } from './_components/share-videos/share-videos.component';
import { PortalTempComponent } from './_components/portal-temp/portal-temp.component';
import { QuestionsComponent } from './_components/questions/questions.component';
import { PollsComponent } from './_components/polls/polls.component';
import { PollsQueueComponent } from './_components/polls/_components/polls-queue/polls-queue.component';
import { PollsOpenComponent } from './_components/polls/_components/polls-open/polls-open.component';
import { PollsClosedComponent } from './_components/polls/_components/polls-closed/polls-closed.component';
import { PollsAttendeeOpenComponent } from './_components/polls/_components/polls-attendee-open/polls-attendee-open.component';
import { PollsAttendeeClosedComponent } from './_components/polls/_components/polls-attendee-closed/polls-attendee-closed.component';
import { PollComponent } from './_components/polls/_components/poll/poll.component';
import { AttendeeOpenDialogComponent } from './_components/polls/_components/attendee-open-dialog/attendee-open-dialog.component';
import { ChatComponent } from './_components/chat/chat.component';

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
    OffersComponent,
    OfferCardComponent,
    ClosedComponent,
    InfoBannerComponent,
    OpenComponent,
    CreateOfferComponent,
    QueueComponent,
    UpcomingComponent,
    RelatedComponent,
    SettingsComponent,
    AudienceComponent,
    GuestsComponent,
    CoHostsComponent,
    ShareVideosComponent,
    PortalTempComponent,
    QuestionsComponent,
    PollsComponent,
    PollsQueueComponent,
    PollsOpenComponent,
    PollsClosedComponent,
    PollsAttendeeOpenComponent,
    PollsAttendeeClosedComponent,
    PollComponent,
    AttendeeOpenDialogComponent,
    ChatComponent,
  ],
  imports: [
    CommonModule,
    PortalRoutingModule,
    SharedModule,
    AppSharedModule,
    CanvasWhiteboardModule,
    SharedQuestionsModule
  ],
})
export class PortalModule { }
