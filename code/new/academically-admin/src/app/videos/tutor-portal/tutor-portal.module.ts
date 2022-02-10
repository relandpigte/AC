import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TutorPortalRoutingModule } from './tutor-portal-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';

import { TutorPortalComponent } from './tutor-portal.component';
import { CommentsComponent } from './_components/comments/comments.component';
import { SidebarComponent } from './_components/sidebar/sidebar.component';
import { HomeComponent } from './_components/home/home.component';
import { DownloadsComponent } from './_components/downloads/downloads.component';

@NgModule({
  declarations: [
    TutorPortalComponent,
    CommentsComponent,
    SidebarComponent,
    HomeComponent,
    DownloadsComponent,
  ],
  imports: [
    CommonModule,
    TutorPortalRoutingModule,
    SharedModule,
    AppSharedModule,
  ],
  exports: [
    CommentsComponent,
  ],
})
export class TutorPortalModule { }
