import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppSharedModule } from '@app/_shared/app-shared.module';
import { SharedModule } from '@shared/shared.module';
import { ForYouRoutingModule } from './for-you-routing.module';

import { ExploreForYouComponent } from './for-you.component';
import { ExploreForYouDetailsComponent } from './for-you-details/for-you-details.component';
import { ExploreEventsModule } from '../events/events.module';
import { ExploreCoursesModule } from '../courses/courses.module';
import { ExploreCoachingModule } from '../coaching/coaching.module';
import { ExploreTutorialsModule } from '../tutorials/tutorials.module';
import { ExploreArticlesModule } from '../articles/articles.module';
import { ExploreSpacesModule } from '../spaces/spaces.module';
import { ExploreUsersModule } from '../users/users.module';

@NgModule({
  declarations: [
    ExploreForYouComponent,
    ExploreForYouDetailsComponent
  ],
  imports: [
    CommonModule,
    ForYouRoutingModule,
    SharedModule,
    AppSharedModule,
    ExploreEventsModule,
    ExploreCoursesModule,
    ExploreCoachingModule,
    ExploreTutorialsModule,
    ExploreArticlesModule,
    ExploreSpacesModule,
    ExploreUsersModule
  ],
})
export class ExploreForYouModule { }
