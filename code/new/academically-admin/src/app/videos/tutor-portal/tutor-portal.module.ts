import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TutorPortalRoutingModule } from './tutor-portal-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';

import { TutorPortalComponent } from './tutor-portal.component';

@NgModule({
  declarations: [
    TutorPortalComponent,
  ],
  imports: [
    CommonModule,
    TutorPortalRoutingModule,
    SharedModule,
    AppSharedModule,
  ],
})
export class TutorPortalModule { }
