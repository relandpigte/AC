import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AboutRoutingModule } from './about-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';
import { SessionBadgeComponent } from './_components/session-badge/session-badge.component';
import { LearnBadgeComponent } from './_components/learn-badge/learn-badge.component';
import { CourseAboutComponent } from '@app/course/about/about.component';
import { InstructorBadgeComponent } from './_components/instructor-badge/instructor-badge.component';
import { RelatedCoursesComponent } from './_components/related-courses/related-courses.component';
import { CurriculumBadgeComponent } from './_components/curriculum-badge/curriculum-badge.component';
import { StartBadgeComponent } from './_components/start-badge/start-badge.component';
import { ReviewBadgeComponent } from '@app/course/about/_components/review-badge/review-badge.component';

@NgModule({
  declarations: [
    CourseAboutComponent,
    SessionBadgeComponent,
    LearnBadgeComponent,
    InstructorBadgeComponent,
    RelatedCoursesComponent,
    CurriculumBadgeComponent,
    StartBadgeComponent,
    ReviewBadgeComponent
  ],
  exports: [
    InstructorBadgeComponent,
    RelatedCoursesComponent,
    StartBadgeComponent,
    ReviewBadgeComponent
  ],
  imports: [
    CommonModule,
    AboutRoutingModule,
    SharedModule,
    AppSharedModule
  ]
})
export class CourseAboutModule { }
