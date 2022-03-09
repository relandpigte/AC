import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortalRoutingModule } from './portal-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';
import { LessonPreviewModule } from '@app/lesson-preview/lesson-preview.module';

import { PortalComponent } from './portal.component';

@NgModule({
  declarations: [
    PortalComponent,
  ],
  imports: [
    CommonModule,
    PortalRoutingModule,
    SharedModule,
    AppSharedModule,
    LessonPreviewModule,
  ],
})
export class PortalModule { }
