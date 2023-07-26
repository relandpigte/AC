import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AboutRoutingModule } from './about-routing.module';
import { CoachingAboutComponent } from './about.component';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';
import { AboutSessionComponent } from './_components/about-session/about-session.component';
import { AboutLearnComponent } from './_components/about-learn/about-learn.component';
import { AboutCoachComponent } from './_components/about-coach/about-coach.component';
import { AboutRelatedCoachingComponent } from './_components/about-related-coaching/about-related-coaching.component';
import { IntroductionModule } from '@app/profile/introduction/introduction.module';

@NgModule({
  declarations: [
    CoachingAboutComponent,
    AboutSessionComponent,
    AboutLearnComponent,
    AboutCoachComponent,
    AboutRelatedCoachingComponent
  ],
  exports: [
    AboutCoachComponent,
    AboutRelatedCoachingComponent
  ],
  imports: [
    CommonModule,
    AboutRoutingModule,
    SharedModule,
    AppSharedModule,
    IntroductionModule,
  ]
})
export class CoachingAboutModule { }
