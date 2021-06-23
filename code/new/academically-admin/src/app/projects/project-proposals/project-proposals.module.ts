import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectProposalsRoutingModule } from './project-proposals-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';

import { ProjectProposalsComponent } from './project-proposals.component';

@NgModule({
  declarations: [
    ProjectProposalsComponent,
  ],
  imports: [
    CommonModule,
    ProjectProposalsRoutingModule,
    SharedModule,
    AppSharedModule,
  ],
})
export class ProjectProposalsModule { }
