import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';
import { VerificationsModule } from '@app/_shared/modules/verifications/verifications.module';
import { CoursesModule } from '@app/dashboard/courses/courses.module';

import { DashboardComponent } from './dashboard.component';
import { OverviewComponent } from './overview/overview.component';
import { ProjectsComponent } from './projects/projects.component';
import { UsageComponent } from './usage/usage.component';
import { MetricsComponent } from './overview/metrics/metrics.component';
import { UpcomingSessionsComponent } from './overview/upcoming-sessions/upcoming-sessions.component';
import { RecentProjectsComponent } from './overview/recent-projects/recent-projects.component';
import { RecentActivityComponent } from './overview/recent-activity/recent-activity.component';
import { ProfileSummaryComponent } from './overview/profile-summary/profile-summary.component';
import { UsageOverviewComponent } from './usage/usage-overview/usage-overview.component';
import { UsageOverviewGraphComponent } from './usage/usage-overview-graph/usage-overview-graph.component';

@NgModule({
  declarations: [
    DashboardComponent,
    OverviewComponent,
    ProjectsComponent,
    UsageComponent,
    MetricsComponent,
    UpcomingSessionsComponent,
    RecentProjectsComponent,
    RecentActivityComponent,
    ProfileSummaryComponent,
    UsageOverviewComponent,
    UsageOverviewGraphComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule,
    AppSharedModule,
    VerificationsModule,
    CoursesModule,
  ],
})
export class DashboardModule { }
