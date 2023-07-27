import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoachingRoutingModule } from './coaching-routing.module';
import { CoachingComponent } from './coaching.component';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';
import { HeaderComponent } from './_components/header/header.component';
import { CoachingAboutModule } from '@app/coaching/about/about.module';
import { CoachingDiscussionModule } from './discussion/discussion.module';

@NgModule({
  declarations: [
    CoachingComponent,
    HeaderComponent
  ],
  imports: [
    CommonModule,
    CoachingRoutingModule,
    SharedModule,
    AppSharedModule,
    CoachingAboutModule,
    CoachingDiscussionModule
  ]
})
export class CoachingModule { }
