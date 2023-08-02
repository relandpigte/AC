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

@NgModule({
  declarations: [
    CourseAboutComponent,
    SessionBadgeComponent,
    LearnBadgeComponent,
    InstructorBadgeComponent,
    RelatedCoursesComponent,
    CurriculumBadgeComponent
  ],
  exports: [
    InstructorBadgeComponent,
    RelatedCoursesComponent
  ],
  imports: [
    CommonModule,
    AboutRoutingModule,
    SharedModule,
    AppSharedModule
  ]
})
export class CourseAboutModule { }
