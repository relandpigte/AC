import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventsDiscussionRoutingModule } from './discussion-routing.module';
import { EventsDiscussionComponent } from './discussion.component';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';
import { IntroductionModule } from '@app/profile/introduction/introduction.module';

@NgModule({
  declarations: [
    EventsDiscussionComponent
  ],
  exports: [
    EventsDiscussionComponent
  ],
  imports: [
    CommonModule,
    EventsDiscussionRoutingModule,
    SharedModule,
    AppSharedModule,
    IntroductionModule,
  ]
})
export class EventsDiscussionModule { }
