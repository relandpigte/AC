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

@NgModule({
  declarations: [
    DashboardComponent,
    OverviewComponent,
    MetricsComponent,
    UpcomingSessionsComponent,
    RecentProjectsComponent,
    RecentActivityComponent,
    ProfileSummaryComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule,
    AppSharedModule,
    VerificationsModule,
  ],
})
export class DashboardModule { }
