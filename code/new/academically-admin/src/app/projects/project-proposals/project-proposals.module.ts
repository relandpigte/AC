import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectProposalsRoutingModule } from './project-proposals-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';

import { ProjectProposalsComponent } from './project-proposals.component';
import { ViewTutorProposalComponent } from './view-tutor-proposal/view-tutor-proposal.component';

@NgModule({
  declarations: [
    ProjectProposalsComponent,
    ViewTutorProposalComponent,
  ],
  imports: [
    CommonModule,
    ProjectProposalsRoutingModule,
    SharedModule,
    AppSharedModule,
  ],
})
export class ProjectProposalsModule { }
