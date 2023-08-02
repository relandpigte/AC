import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AboutRoutingModule } from './about-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';
import { OrganizerBadgeComponent } from './_components/organizer-badge/organizer-badge.component';
import { AttendeesBadgeComponent } from './_components/attendees-badge/attendees-badge.component';
import { RelatedEventsBadgeComponent } from './_components/related-events-badge/related-events-badge.component';
import { SessionBadgeComponent } from './_components/session-badge/session-badge.component';
import { LearnBadgeComponent } from './_components/learn-badge/learn-badge.component';
import { EventsAboutComponent } from '@app/events/about/about.component';
import { PresentersBadgeComponent } from './_components/presenters-badge/presenters-badge.component';

@NgModule({
  declarations: [
    EventsAboutComponent,
    OrganizerBadgeComponent,
    AttendeesBadgeComponent,
    RelatedEventsBadgeComponent,
    SessionBadgeComponent,
    LearnBadgeComponent,
    PresentersBadgeComponent
  ],
  exports: [
    OrganizerBadgeComponent,
    RelatedEventsBadgeComponent,
    AttendeesBadgeComponent
  ],
  imports: [
    CommonModule,
    AboutRoutingModule,
    SharedModule,
    AppSharedModule
  ]
})
export class EventsAboutModule { }
