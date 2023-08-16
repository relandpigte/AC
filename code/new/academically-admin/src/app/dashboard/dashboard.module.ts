import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';
import { VerificationsModule } from '@app/_shared/modules/verifications/verifications.module';

import { DashboardComponent } from './dashboard.component';
import { OverviewComponent } from './overview/overview.component';
import { MetricsComponent } from './overview/metrics/metrics.component';
import { UpcomingSessionsComponent } from './overview/upcoming-sessions/upcoming-sessions.component';
import { RecentProjectsComponent } from './overview/recent-projects/recent-projects.component';
import { RecentActivityComponent } from './overview/recent-activity/recent-activity.component';
import { ProfileSummaryComponent } from './overview/profile-summary/profile-summary.component';
import { SubHeaderComponent } from './_components/sub-header/sub-header.component';
import { CreatorComponent } from './overview/creator/creator.component';
import { LearnerComponent } from './overview/learner/learner.component';
import { FullCalendarModule } from '@node_modules/@fullcalendar/angular';
import { CalendarModule } from '@app/calendar/calendar.module';
import { StudentCalendarComponent } from '@app/dashboard/overview/learner/student-calendar/student-calendar.component';
import { StudentLearningComponent } from '@app/dashboard/overview/learner/student-learning/student-learning.component';
import { StudentMetricsComponent } from './overview/learner/student-metrics/student-metrics.component';

@NgModule({
  declarations: [
    DashboardComponent,
    OverviewComponent,
    MetricsComponent,
    UpcomingSessionsComponent,
    RecentProjectsComponent,
    RecentActivityComponent,
    ProfileSummaryComponent,
    SubHeaderComponent,
    CreatorComponent,
    LearnerComponent,
    StudentLearningComponent,
    StudentCalendarComponent,
    StudentMetricsComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule,
    AppSharedModule,
    VerificationsModule,
    FullCalendarModule,
    CalendarModule
  ],
  exports: [
    SubHeaderComponent
  ]
})
export class DashboardModule { }
