import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowseProjectsRoutingModule } from './browse-projects-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';

import { BrowseProjectsComponent } from './browse-projects.component';

@NgModule({
  declarations: [
    BrowseProjectsComponent,
  ],
  imports: [
    CommonModule,
    BrowseProjectsRoutingModule,
    SharedModule,
    AppSharedModule,
  ],
})
export class BrowseProjectsModule { }
