import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentPortalRoutingModule } from './student-portal-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';

import { StudentPortalComponent } from './student-portal.component';
import { LayoutComponent } from './_components/layout/layout.component';
import { PortalMenuComponent } from './_components/portal-menu/portal-menu.component';
import { CourseMenuComponent } from './_components/course-menu/course-menu.component';
import { DiscussionsComponent } from './_components/discussions/discussions.component';

@NgModule({
  declarations: [
    StudentPortalComponent,
    LayoutComponent,
    PortalMenuComponent,
    CourseMenuComponent,
    DiscussionsComponent,
  ],
  imports: [
    CommonModule,
    StudentPortalRoutingModule,
    SharedModule,
    AppSharedModule,
  ],
  exports: [
    DiscussionsComponent,
  ],
})
export class StudentPortalModule { }
