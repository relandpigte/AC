import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectProposalsRoutingModule } from './project-proposals-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';

import { ProjectProposalsComponent } from './project-proposals.component';
import { ViewTutorProposalComponent } from './view-tutor-proposal/view-tutor-proposal.component';
import { CreateEditSessionComponent } from './view-tutor-proposal/_components/create-edit-session/create-edit-session.component';
import { CalendarModule } from '@app/calendar/calendar.module';

@NgModule({
  declarations: [
    ProjectProposalsComponent,
    ViewTutorProposalComponent,
    CreateEditSessionComponent,
  ],
  imports: [
    CommonModule,
    ProjectProposalsRoutingModule,
    SharedModule,
    AppSharedModule,
    CalendarModule,
  ],
})
export class ProjectProposalsModule { }
