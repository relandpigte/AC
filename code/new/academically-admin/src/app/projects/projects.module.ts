import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectsRoutingModule } from './projects-routing.module';
import { SharedModule } from '@shared/shared.module';

import { AppSharedModule } from '@app/_shared/app-shared.module';
import { HeaderComponent } from './_components/header/header.component';
import { ProjectDetailsHeaderComponent } from './_components/project-details-header/project-details-header.component';
@NgModule({
  declarations: [
    HeaderComponent,
    ProjectDetailsHeaderComponent
  ],
  imports: [
    CommonModule,
    ProjectsRoutingModule,
    SharedModule,
    AppSharedModule,
  ],
})
export class ProjectsModule { }
