import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventsRoutingModule } from './events-routing.module';
import { EventsComponent } from './events.component';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';
import { HeaderComponent } from './_components/header/header.component';
import { EventsAboutModule } from '@app/events/about/about.module';
import { RatingComponent } from '@app/events/_components/rating/rating.component';
import { ThankYouComponent } from '@app/events/_components/thank-you/thank-you.component';

@NgModule({
  declarations: [
    EventsComponent,
    HeaderComponent,
    RatingComponent,
    ThankYouComponent
  ],
  imports: [
    CommonModule,
    EventsRoutingModule,
    SharedModule,
    AppSharedModule,
    EventsAboutModule
  ]
})
export class EventsModule { }
